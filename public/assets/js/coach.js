const KEY_PREFIX = "reflex_core_coaching_nav_v1:";

function initialNavState(tree) {
  const start = tree.nodes[tree.start] ? tree.start : Object.keys(tree.nodes)[0] ?? "start";
  return { currentNodeId: start, history: [] };
}

function ensureKnownNode(tree, state) {
  if (tree.nodes[state.currentNodeId]) return state;
  return initialNavState(tree);
}

function choose(session, nodeId, choiceId, history = []) {
  const tree = session.tree;
  const s = ensureKnownNode(tree, { currentNodeId: nodeId, history });
  const node = tree.nodes[s.currentNodeId];
  if (!node) return { ok: false, error: "unknown_node", state: initialNavState(tree) };
  if (node.outcome !== "continue") return { ok: false, error: "terminal_node", state: s };
  const match = node.choices.find((c) => c.id === choiceId);
  if (!match) return { ok: false, error: "invalid_choice", state: s };
  if (!tree.nodes[match.next]) return { ok: false, error: "bad_next", state: s };
  return {
    ok: true,
    state: { currentNodeId: match.next, history: [...s.history, s.currentNodeId] },
  };
}

function rewindTo(tree, state, nodeId) {
  if (!tree.nodes[nodeId]) {
    return { ok: false, error: "bad_rewind_target", state: ensureKnownNode(tree, state) };
  }
  const idx = state.history.indexOf(nodeId);
  if (idx === -1) return { ok: true, state: { currentNodeId: nodeId, history: [] } };
  return { ok: true, state: { currentNodeId: nodeId, history: state.history.slice(0, idx) } };
}

function stepBack(tree, state) {
  const s = ensureKnownNode(tree, state);
  const node = tree.nodes[s.currentNodeId];
  if (!node) return { ok: false, error: "unknown_node", state: initialNavState(tree) };
  if (node.outcome === "wrong" && node.rewind_to) return rewindTo(tree, s, node.rewind_to);
  if (s.history.length === 0) return { ok: false, error: "no_history", state: s };
  const history = s.history.slice(0, -1);
  const currentNodeId = s.history[s.history.length - 1];
  if (!tree.nodes[currentNodeId]) return { ok: true, state: initialNavState(tree) };
  return { ok: true, state: { currentNodeId, history } };
}

function canStepBack(tree, state) {
  const s = ensureKnownNode(tree, state);
  const node = tree.nodes[s.currentNodeId];
  if (!node) return false;
  if (node.outcome === "wrong" && node.rewind_to) return true;
  return s.history.length > 0;
}

function choiceLabelBetween(tree, fromId, toId) {
  const from = tree.nodes[fromId];
  if (!from) return null;
  return from.choices.find((c) => c.next === toId)?.label ?? null;
}

function buildPathTrail(tree, state) {
  const sequence = [...state.history, state.currentNodeId];
  return sequence.map((nodeId, index) => {
    const node = tree.nodes[nodeId];
    const nextId = sequence[index + 1];
    const isCurrent = index === sequence.length - 1;
    return {
      index: index + 1,
      nodeId,
      outcome: node?.outcome ?? "continue",
      choiceLabel: !isCurrent && nextId ? choiceLabelBetween(tree, nodeId, nextId) : null,
      isCurrent,
    };
  });
}

function loadNav(slug, tree) {
  try {
    const raw = sessionStorage.getItem(KEY_PREFIX + slug);
    if (!raw) return initialNavState(tree);
    const parsed = JSON.parse(raw);
    if (typeof parsed.currentNodeId !== "string" || !Array.isArray(parsed.history)) {
      return initialNavState(tree);
    }
    return ensureKnownNode(tree, parsed);
  } catch {
    return initialNavState(tree);
  }
}

function saveNav(slug, state) {
  try {
    sessionStorage.setItem(KEY_PREFIX + slug, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function clearNav(slug) {
  try {
    sessionStorage.removeItem(KEY_PREFIX + slug);
  } catch {
    /* ignore */
  }
}

export function initCoach() {
  const root = document.querySelector(".js-coach");
  const sessionNode = document.getElementById("coach-session");
  const slugNode = document.getElementById("coach-slug");
  if (!root || !sessionNode || !slugNode) return;
  const session = JSON.parse(sessionNode.textContent);
  const slug = JSON.parse(slugNode.textContent);
  const tree = session.tree;
  let nav = loadNav(slug, tree);
  let skipFocus = true;

  const panel = root.querySelector("#coach-message");
  const label = root.querySelector(".js-coach-label");
  const message = root.querySelector(".js-coach-message");
  const choices = root.querySelector(".js-coach-choices");
  const rewind = root.querySelector(".js-coach-rewind");
  const back = root.querySelector(".js-coach-back");
  const restart = root.querySelector(".js-coach-restart");
  const trail = root.querySelector(".js-coach-trail");

  const render = () => {
    const state = ensureKnownNode(tree, nav);
    const node = tree.nodes[state.currentNodeId];
    if (!node) return;
    panel.className = `coach-panel coach-${node.outcome}`;
    label.textContent =
      node.outcome === "continue" ? "Decide" : node.outcome === "wrong" ? "Wrong · review" : "Success";
    message.textContent = node.message;
    const showChoices = node.outcome === "continue" && node.choices.length > 0;
    choices.hidden = !showChoices;
    choices.replaceChildren();
    if (showChoices) {
      node.choices.forEach((choice) => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.dataset.choiceId = choice.id;
        btn.textContent = choice.label;
        btn.addEventListener("click", () => {
          const result = choose(session, state.currentNodeId, choice.id, state.history);
          if (result.ok) commit(result.state);
        });
        li.append(btn);
        choices.append(li);
      });
    }
    rewind.hidden = node.outcome !== "wrong";
    back.hidden = node.outcome === "wrong" || !canStepBack(tree, state);
    trail.replaceChildren();
    buildPathTrail(tree, state).forEach((step) => {
      const li = document.createElement("li");
      if (step.isCurrent) li.className = "current";
      const prefix = step.choiceLabel ? `${step.choiceLabel} → ` : "";
      li.innerHTML = `<span>${prefix}</span>${step.isCurrent ? "You are here" : step.outcome}`;
      trail.append(li);
    });
    if (!skipFocus) panel.focus();
    skipFocus = false;
  };

  const commit = (next, clear = false) => {
    nav = next;
    if (clear) clearNav(slug);
    else saveNav(slug, next);
    render();
  };

  rewind.addEventListener("click", () => {
    const result = stepBack(tree, nav);
    if (result.ok) commit(result.state);
  });
  back.addEventListener("click", () => {
    const result = stepBack(tree, nav);
    if (result.ok) commit(result.state);
  });
  restart.addEventListener("click", () => commit(initialNavState(tree), true));
  render();
}
