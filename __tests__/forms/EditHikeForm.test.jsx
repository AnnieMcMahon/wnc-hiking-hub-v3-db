import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditHikeForm from "@/app/ui/forms/EditHikeForm";

describe("EditHikeForm", () => {
  describe("rendering", () => {
   it("renders an EditHikeForm component", () => {
      render(<EditHikeForm />);
      expect(screen.getByText(/save changes/i)).toBeInTheDocument();
    });
  });

  describe("functional", () => {
    it("does not throw when props are not provided", async () => {
      render(<EditHikeForm />);
      const saveButton = screen.getByRole("button", { name: /save changes/i });
      await userEvent.click(saveButton);
      const discardButton = screen.getByRole("button", { name: /discard changes/i });
      await userEvent.click(discardButton);
      const cancelButton = screen.getByRole("button", { name: /cancel hike/i });
      await userEvent.click(cancelButton);
    });

    

  });
});
