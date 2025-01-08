import { convertDate, convertTime, validatePassword } from "@/app/lib/utils";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

describe("convertDate", () => {
  it("correctly formats a date in America/New_York timezone", () => {
    const originalDate = "2025-01-08T12:00:00Z";
    const expected = "Wed, 01/08/2025";
    expect(convertDate(originalDate)).toBe(expected);
  });
});

describe("convertTime", () => {
  it("correctly converts 24-hour time to 12-hour time with AM/PM", () => {
    expect(convertTime("14:30")).toBe("2:30 PM");
    expect(convertTime("00:15")).toBe("12:15 AM");
    expect(convertTime("12:00")).toBe("12:00 PM");
    expect(convertTime("23:45")).toBe("11:45 PM");
  });
});

describe("validatePassword", () => {
  it("returns null for a valid password", () => {
    const validPassword = "StrongP@ssword1";
    expect(validatePassword(validPassword)).toBeNull();
  });

  it("validates password length", () => {
    const shortPassword = "Ab1!";
    expect(validatePassword(shortPassword)).toBe("Password must be at least 6 characters.");
  });

  it("validates uppercase letter presence", () => {
    const noUppercase = "password1!";
    expect(validatePassword(noUppercase)).toBe("Password must contain at least one uppercase letter.");
  });

  it("validates numeric character presence", () => {
    const noNumber = "Password!";
    expect(validatePassword(noNumber)).toBe("Password must contain at least one number.");
  });

  it("validates special character presence", () => {
    const noSpecialChar = "Password1";
    expect(validatePassword(noSpecialChar)).toBe("Password must contain at least one special character.");
  });
});
