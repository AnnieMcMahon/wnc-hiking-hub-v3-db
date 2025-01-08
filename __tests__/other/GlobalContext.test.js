import { render, screen, waitFor } from "@testing-library/react";
import { GlobalProvider, useGlobal } from "@/app/context/GlobalContext";
import { retrieveUser } from "@/app/api/authentication/auth";
import { fetchUserByEmail } from "@/app/api/data/data";
import { DEFAULT_USER } from "@/app/lib/constants";
import userEvent from "@testing-library/user-event";

jest.mock("@/app/api/authentication/auth", () => ({
  retrieveUser: jest.fn(),
}));

jest.mock("@/app/api/data/data", () => ({
  fetchUserByEmail: jest.fn(),
}));

function TestComponent() {
  const { currentUser, hike, setHike, triggerRefresh, setTriggerRefresh } = useGlobal();
  return (
    <div>
      <p data-testid="current-user">{JSON.stringify(currentUser)}</p>
      <button onClick={() => setHike("Test Hike")}>Set Hike</button>
      <button onClick={() => setTriggerRefresh(true)}>Trigger Refresh</button>
      <p data-testid="hike">{hike}</p>
      <p data-testid="trigger-refresh">{String(triggerRefresh)}</p>
    </div>
  );
}

describe("GlobalContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("provides default values correctly", () => {
    render(
      <GlobalProvider>
        <TestComponent />
      </GlobalProvider>
    );
    expect(screen.getByTestId("current-user").textContent).toBe(JSON.stringify(DEFAULT_USER));
    expect(screen.getByTestId("hike").textContent).toBe("");
    expect(screen.getByTestId("trigger-refresh").textContent).toBe("false");
  });

  it("updates context values correctly", async () => {
    render(
      <GlobalProvider>
        <TestComponent />
      </GlobalProvider>
    );
    const hikeButton = screen.getByText("Set Hike");
    const refreshButton = screen.getByText("Trigger Refresh");
    await userEvent.click(hikeButton);
    await userEvent.click(refreshButton);
    expect(screen.getByTestId("hike").textContent).toBe("Test Hike");
    expect(screen.getByTestId("trigger-refresh").textContent).toBe("true");
  });

  it("fetches user data and updates currentUser", async () => {
    const mockUser = { email: "test@example.com" };
    const mockUserInfo = [{ id: 1, name: "Test User" }];
    retrieveUser.mockResolvedValue(mockUser);
    fetchUserByEmail.mockResolvedValue(mockUserInfo);
    render(
      <GlobalProvider>
        <TestComponent />
      </GlobalProvider>
    );
    await waitFor(() =>
      expect(screen.getByTestId("current-user").textContent).toBe(JSON.stringify(mockUserInfo[0]))
    );
  });

  it("does not update currentUser if no user is retrieved", async () => {
    retrieveUser.mockResolvedValue(null);
    render(
      <GlobalProvider>
        <TestComponent />
      </GlobalProvider>
    );
    await waitFor(() =>
      expect(screen.getByTestId("current-user").textContent).toBe(JSON.stringify(DEFAULT_USER))
    );
  });

  it("does not update currentUser if fetchUserByEmail returns empty", async () => {
    const mockUser = { email: "test@example.com" };
    retrieveUser.mockResolvedValue(mockUser);
    fetchUserByEmail.mockResolvedValue([]);
    render(
      <GlobalProvider>
        <TestComponent />
      </GlobalProvider>
    );
    await waitFor(() =>
      expect(screen.getByTestId("current-user").textContent).toBe(JSON.stringify(DEFAULT_USER))
    );
  });
});