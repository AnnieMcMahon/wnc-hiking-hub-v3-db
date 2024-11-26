import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchForm from "@/app/ui/forms/SearchForm";
import { ANY_AREA, ANY_DIFFICULTY, ANY_LENGTH } from "@/app/lib/constants";

describe("SearchForm", () => {
  describe("rendering", () => {
    it("renders a SearchForm component", () => {
      render(<SearchForm />);
      expect(screen.getByText(/area name/i)).toBeInTheDocument();
    });

    it("renders default data correctly", () => {
      render(<SearchForm />);
      expect(screen.getByText("Anywhere in WNC")).toBeInTheDocument();
      expect(screen.getByText("Any difficulty")).toBeInTheDocument();
      expect(screen.getByText("Any length")).toBeInTheDocument();
    });

    it("renders dropdowns with default values", () => {
      render(<SearchForm />);
      const areaDropdown = screen.getByRole("combobox", { name: /area name/i });
      const difficultyDropdown = screen.getByRole("combobox", {
        name: /difficulty rating/i,
      });
      const lengthDropdown = screen.getByRole("combobox", { name: /length/i });
      expect(areaDropdown).toHaveValue(ANY_AREA);
      expect(difficultyDropdown).toHaveValue(ANY_DIFFICULTY);
      expect(lengthDropdown).toHaveValue(ANY_LENGTH);
    });

    it("renders all area options correctly", () => {
      render(<SearchForm />);
      const areaDropdown = screen.getByRole("combobox", { name: /area name/i });
      const options = Array.from(areaDropdown.options).map(
        (option) => option.text
      );
      expect(options).toEqual([
        "Anywhere in WNC",
        "DuPont State Recreational Forest",
        "Pisgah National Forest",
        "North Carolina Arboretum",
        "Nantahala Forest",
      ]);
    });
  });

  describe("functional", () => {
    it("calls onSearch with the correct arguments when a dropdown value changes", async () => {
      const mockOnSearch = jest.fn();
      render(<SearchForm onSearch={mockOnSearch} />);
      const user = userEvent.setup();
      const areaDropdown = screen.getByRole("combobox", { name: /area name/i });
      await user.selectOptions(areaDropdown, "Pisgah National Forest");
      expect(mockOnSearch).toHaveBeenCalledWith(
        "area",
        "Pisgah National Forest"
      );
      const difficultyDropdown = screen.getByRole("combobox", {
        name: /difficulty rating/i,
      });
      await user.selectOptions(difficultyDropdown, "moderate");
      expect(mockOnSearch).toHaveBeenCalledWith("difficulty", "moderate");
      const lengthDropdown = screen.getByRole("combobox", { name: /length/i });
      await user.selectOptions(lengthDropdown, "From 3 to 6 miles");
      expect(mockOnSearch).toHaveBeenCalledWith("length", "From 3 to 6 miles");
    });
  });
});
