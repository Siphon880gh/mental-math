import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { defaultProgress, saveProgress } from "./lib/progressStore";

afterEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

test("renders app title", () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  expect(screen.getByRole("heading", { name: /mental math trainer/i })).toBeInTheDocument();
});

test("logo goes Home and nav splits tracks, no Home or Archive", () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  const nav = screen.getByRole("navigation");
  expect(within(nav).queryByRole("link", { name: /^home$/i })).not.toBeInTheDocument();
  expect(within(nav).queryByRole("link", { name: /^guides$/i })).not.toBeInTheDocument();
  expect(within(nav).getByRole("link", { name: /^track a$/i })).toHaveAttribute("href", "/track-a");
  expect(within(nav).getByRole("link", { name: /^track b$/i })).toHaveAttribute("href", "/track-b");
  expect(within(nav).getByRole("link", { name: /^drills$/i })).toBeInTheDocument();
  expect(within(nav).getByRole("link", { name: /^cases$/i })).toBeInTheDocument();
  expect(within(nav).getByRole("link", { name: /^scenarios$/i })).toBeInTheDocument();
  expect(within(nav).getByRole("link", { name: /^games$/i })).toBeInTheDocument();
  expect(within(nav).queryByRole("link", { name: /^archive$/i })).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: /mental math trainer/i })).toHaveAttribute("href", "/");
  expect(nav.closest("header")).toBeNull();
});

test("guides hub splits tracks and redirects archive to Track A", () => {
  render(
    <MemoryRouter initialEntries={["/archive"]}>
      <App />
    </MemoryRouter>,
  );
  expect(
    screen.getByRole("heading", {
      name: /a\. quick math for business and everyday life/i,
    }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("heading", {
      name: /b\. business and entrepreneurship stakeholder discussion and planning math/i,
    }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: /number anchors/i })).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: /fully loaded headcount/i })).not.toBeInTheDocument();
  // Tag group labels live inside the Filter popover — open it to assert them.
  const filterBtn = screen.getAllByRole("button", { name: /^filter$/i })[0];
  fireEvent.click(filterBtn);
  expect(screen.getAllByText(/first-pass tag/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/second-pass tag/i).length).toBeGreaterThan(0);
});

test("guide page renders lesson body from docs-more", () => {
  render(
    <MemoryRouter initialEntries={["/guides/dilution"]}>
      <App />
    </MemoryRouter>,
  );
  expect(screen.getByText(/percent sold ≈ cash \/ post-money/i)).toBeInTheDocument();
  expect(
    screen.getByText(/b\. business and entrepreneurship stakeholder discussion/i),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /open coach: dilution/i })).toBeInTheDocument();
});

test("guides list navigates to a lesson", async () => {
  render(
    <MemoryRouter initialEntries={["/track-b"]}>
      <App />
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole("link", { name: /dilution and post-money/i }));
  expect(await screen.findByRole("heading", { name: /dilution and post-money/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /open coach: dilution/i })).toBeInTheDocument();
});

test("track A guide opens a playable coach on the same slug", async () => {
  render(
    <MemoryRouter initialEntries={["/guides/anchors"]}>
      <App />
    </MemoryRouter>,
  );
  expect(
    screen.getByText(/a\. quick math for business and everyday life/i),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("link", { name: /open coach: anchors/i }));
  expect(
    await screen.findByRole("heading", { name: /hear the chord, then scale zeros/i }),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /hear 5 × 4 = 20/i })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /stack 50 under 40/i }));
  expect(await screen.findByText(/rewind and try again/i)).toBeInTheDocument();
});

test("unknown coach slug recovers without a 404", () => {
  render(
    <MemoryRouter initialEntries={["/coach/not-a-family"]}>
      <App />
    </MemoryRouter>,
  );
  expect(screen.getByText(/not authored yet/i)).toBeInTheDocument();
  expect(screen.getAllByRole("link", { name: /^track a$/i }).length).toBeGreaterThan(0);
});

test("home shows first-run copy and a real next drill CTA", () => {
  localStorage.clear();
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  expect(screen.getByText(/five minutes of reflex training, no calculator/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /continue/i })).toHaveAttribute("href", "/drills/anchors");
});

test("cases entry names the fluency gate and hides thought chains", () => {
  localStorage.clear();
  render(
    <MemoryRouter initialEntries={["/cases"]}>
      <App />
    </MemoryRouter>,
  );
  expect(
    screen.getByText(/graded cases stay locked until the timed fluency gate/i),
  ).toBeInTheDocument();
  expect(
    screen.getAllByText(/percents \+ conversions timed gate/i).length,
  ).toBeGreaterThan(0);
  expect(screen.queryByText(/hourly ×720/i)).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: /browse this session/i })).toBeInTheDocument();
});

test("browse this session opens locked cases without unlocking the gate", () => {
  localStorage.clear();
  render(
    <MemoryRouter initialEntries={["/cases"]}>
      <App />
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole("button", { name: /browse this session/i }));
  expect(screen.getByRole("link", { name: /sf-gpu-18/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /turn off temporary peek/i })).toBeInTheDocument();
  expect(screen.queryByText(/hourly ×720/i)).not.toBeInTheDocument();
});

test("open this drill this session plays a locked path group", () => {
  localStorage.clear();
  render(
    <MemoryRouter initialEntries={["/drills/percents"]}>
      <App />
    </MemoryRouter>,
  );
  expect(screen.getByRole("heading", { name: /percents/i })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /open this drill this session/i }));
  expect(screen.getByText(/1% of 8,500/i)).toBeInTheDocument();
});

test("unlocked case shows the prompt and hides the chain until submit", () => {
  localStorage.clear();
  const state = defaultProgress();
  state.milestones["E4.M0"] = "complete";
  saveProgress(state);
  render(
    <MemoryRouter initialEntries={["/cases/sf-gpu-18"]}>
      <App />
    </MemoryRouter>,
  );
  expect(screen.getByText(/gpu is \$1\/hr and we charge \$40\/mo/i)).toBeInTheDocument();
  expect(screen.queryByText(/hourly ×720 → \$720\/mo/i)).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText(/your number/i), { target: { value: "18" } });
  fireEvent.click(screen.getByRole("button", { name: /submit/i }));
  expect(screen.getByText(/hourly ×720 → \$720\/mo/i)).toBeInTheDocument();
});

test("unknown game slug 404s", () => {
  render(
    <MemoryRouter initialEntries={["/games/not-a-game"]}>
      <App />
    </MemoryRouter>,
  );
  expect(screen.getByRole("heading", { name: /game not found/i })).toBeInTheDocument();
});

test("scenarios split by track and hide cheat until asked", () => {
  render(
    <MemoryRouter initialEntries={["/scenarios"]}>
      <App />
    </MemoryRouter>,
  );
  expect(screen.getByRole("heading", { name: /scenarios/i })).toBeInTheDocument();
  expect(
    screen.getByRole("heading", {
      name: /a\. quick math for business and everyday life/i,
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", {
      name: /b\. business and entrepreneurship stakeholder discussion and planning math/i,
    }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("link", { name: /one gpu, one price/i }));
  expect(screen.getByText(/gpu is \$1\/hr/i)).toBeInTheDocument();
  expect(screen.queryByText(/users = 720 ÷ 40 = 18/i)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /^hint$/i }));
  expect(screen.getByText(/×720 shortcut/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /^cheat$/i }));
  expect(screen.getByText(/users = 720 ÷ 40 = 18/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /^18$/i }));
  expect(screen.getByText(/correct\. sample only/i)).toBeInTheDocument();
});
