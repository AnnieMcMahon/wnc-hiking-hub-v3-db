import { supabase } from "@/app/api/data/initSupabase";
import { MOCK_TRAIL_INFO, MOCK_USER, MOCK_HIKE } from "@/app/lib/constants";
import {
  fetchAllTrails,
  fetchTrailById,
  addTrail,
  fetchUserByEmail,
  fetchUserById,
  addUser,
  updateUser,
  uploadAvatar,
  addHike,
  fetchHikeById,
  fetchAvailableHikes,
  updateHike,
  fetchParticipantsByHike,
  fetchHikesByParticipant,
  addParticipant,
  removeParticipant
} from "@/app/api/data/data";

jest.mock("@/app/api/data/initSupabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      eq: jest.fn(),
      upload: jest.fn(),
      getPublicUrl: jest.fn(),
    })),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        getPublicUrl: jest.fn(),
      })),
    },
  },
}));

describe("Trail functions", () => {
  const mockTrails = [
    {
      id: 5,
      trail_name: "Blue Ridge Trail",
      area_name: "Blue Ridge Mountains",
      difficulty_rating: "moderate",
      length: 5.4,
      elevation_gain: 1200,
      route_type: "loop",
      trail_link: "https://www.alltrails.com/trail/blue-ridge-trail",
    },
    {
      id: 6,
      trail_name: "Red Trail",
      area_name: "Blue Ridge Mountains",
      difficulty_rating: "easy",
      length: 2.4,
      elevation_gain: 1200,
      route_type: "loop",
      trail_link: "some-link",
    },
  ];

  describe("fetchAllTrails", () => {
    it("returns data when Supabase query is successful", async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: mockTrails, error: null }),
      });
      const result = await fetchAllTrails();
      expect(result).toEqual(mockTrails);
      expect(supabase.from).toHaveBeenCalledWith("trails");
    });

    it("throws an error when Supabase query fails", async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: null, error: "Error" }),
      });
      await expect(fetchAllTrails()).rejects.toThrow(
        "Failed to fetch trail data."
      );
    });
  });

  describe("fetchTrailById", () => {
    it("returns trail data for the given ID", async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest
            .fn()
            .mockResolvedValue({ data: [MOCK_TRAIL_INFO], error: null }),
        }),
      });
      const result = await fetchTrailById(1);
      expect(result).toEqual([MOCK_TRAIL_INFO]);
      expect(supabase.from).toHaveBeenCalledWith("trails");
    });

    it("throws an error when Supabase query fails", async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: null, error: "Error" }),
        }),
      });
      await expect(fetchTrailById(1)).rejects.toThrow(
        "Failed to fetch trail data."
      );
    });
  });

  describe("addTrail", () => {
    it("adds a new trail", async () => {
      supabase.from.mockReturnValue({
        insert: jest.fn().mockResolvedValue({
          data: [MOCK_TRAIL_INFO],
          error: null,
        }),
      });
      const result = await addTrail(MOCK_TRAIL_INFO);
      expect(result).toEqual([MOCK_TRAIL_INFO]);
      expect(supabase.from).toHaveBeenCalledWith("trails");
    });

    it("throws an error when Supabase query fails", async () => {
      supabase.from.mockReturnValue({
        insert: jest.fn().mockResolvedValue({
          data: null,
          error: "Error",
        }),
      });
      await expect(addTrail(MOCK_TRAIL_INFO)).rejects.toThrow(
        "Failed to add new trail."
      );
    });
  });
});

describe("User functions", () => {
  describe("fetchUserByEmail", () => {
    it("returns user data for the given e-mail", async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: [MOCK_USER], error: null }),
        }),
      });
      const result = await fetchUserByEmail("casualhiker@gmail.com");
      expect(result).toEqual([MOCK_USER]);
      expect(supabase.from).toHaveBeenCalledWith("users");
    });

    it("throws an error when Supabase query fails", async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: null, error: "Error" }),
        }),
      });
      await expect(fetchUserByEmail("casualhiker@gmail.com")).rejects.toThrow(
        "Failed to fetch user data."
      );
    });
  });

  describe("fetchUserById", () => {
    it("returns user data for the given ID", async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: [MOCK_USER], error: null }),
        }),
      });
      const result = await fetchUserById(2);
      expect(result).toEqual([MOCK_USER]);
      expect(supabase.from).toHaveBeenCalledWith("users");
    });

    it("throws an error when Supabase query fails", async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: null, error: "Error" }),
        }),
      });
      await expect(fetchUserById(2)).rejects.toThrow(
        "Failed to fetch user data."
      );
    });
  });

  describe("addUser", () => {
    it("adds a new user successfully", async () => {
      supabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({
            data: [MOCK_USER],
            error: null,
          }),
        }),
      });
      const result = await addUser(MOCK_USER);
      expect(result).toEqual([MOCK_USER]);
      expect(supabase.from).toHaveBeenCalledWith("users");
    });

    it("throws an error when Supabase query fails", async () => {
      supabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({
            data: null,
            error: "Error",
          }),
        }),
      });
      await expect(addUser(MOCK_USER)).rejects.toThrow("Failed to add user.");
    });
  });

  describe("updateUser", () => {
    it("updates a user successfully", async () => {
      supabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [MOCK_USER],
            error: null,
          }),
        }),
      });
      await expect(updateUser(MOCK_USER)).resolves.not.toThrow();
      expect(supabase.from).toHaveBeenCalledWith("users");
    });

    it("throws an error when Supabase query fails", async () => {
      supabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null,
            error: "Error",
          }),
        }),
      });
      await expect(updateUser(MOCK_USER)).rejects.toThrow(
        "Failed to update user."
      );
    });
  });

  describe("uploadAvatar", () => {
    it("uploads the avatar successfully", async () => {
      const mockFile = new File(["avatar-content"], "avatar.png", {
        type: "image/png",
      });
      const mockPublicUrl = "https://example.com/avatar.png";
      supabase.storage = {
        from: jest.fn().mockReturnValue({
          upload: jest.fn().mockResolvedValue({ data: {}, error: null }),
          getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: mockPublicUrl } }),
        }),
      };

      const publicUrl = await uploadAvatar(mockFile, 2);

      expect(supabase.storage.from).toHaveBeenCalledWith("avatars");
      expect(supabase.storage.from("avatars").upload).toHaveBeenCalledWith(
        "2-avatar.png",
        mockFile,
        { cacheControl: "3600", upsert: true }
      );
      expect(publicUrl).toBe(mockPublicUrl);
    });

    it("throws an error when Supabase query fails", async () => {
      const mockFile = new File(["avatar-content"], "avatar.png", {
        type: "image/png",
      });
      supabase.storage = {
        from: jest.fn().mockReturnValue({
          upload: jest.fn().mockResolvedValue({ data: null, error: "Upload failed" }),
        }),
      };
      await expect(uploadAvatar(mockFile, 2)).rejects.toThrow(
        "Failed to upload avatar."
      );
    });
  });
});

describe("Hike functions", () => {
  describe("addHike", () => {
    it("adds a new hike successfully", async () => {
      supabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({
            data: [MOCK_HIKE],
            error: null,
          }),
        }),
      });
      const result = await addHike(MOCK_HIKE);
      expect(result).toEqual([MOCK_HIKE]);
      expect(supabase.from).toHaveBeenCalledWith("hikes");
    });

    it("throws an error when Supabase query fails", async () => {
      supabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({
            data: null,
            error: "Error",
          }),
        }),
      });
      await expect(addHike(MOCK_HIKE)).rejects.toThrow("Failed to add new hike.");
    });
  });

  describe("fetchHikeById", () => {
    it("returns hike data for the given ID", async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: [MOCK_HIKE], error: null }),
        }),
      });
      const result = await fetchHikeById(5);
      expect(result).toEqual([MOCK_HIKE]);
      expect(supabase.from).toHaveBeenCalledWith("hikes");
    });

    it("throws an error when Supabase query fails", async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: null, error: "Error" }),
        }),
      });
      await expect(fetchHikeById(5)).rejects.toThrow(
        "Failed to fetch hike data."
      );
    });
  });

  describe("updateHike", () => {
    it("updates a hike successfully", async () => {
      supabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [MOCK_HIKE],
            error: null,
          }),
        }),
      });
      await expect(updateHike(MOCK_HIKE)).resolves.not.toThrow();
      expect(supabase.from).toHaveBeenCalledWith("hikes");
    });

    it("throws an error when Supabase query fails", async () => {
      supabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null,
            error: "Error",
          }),
        }),
      });
      await expect(updateHike(MOCK_HIKE)).rejects.toThrow(
        "Failed to update hike."
      );
    });
  });

  describe("fetchAvailableHikes", () => {
    it("returns available hikes for the given user", async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          neq: jest.fn().mockReturnValue({
            neq: jest.fn().mockReturnValue({
              gte: jest.fn().mockReturnValue({
                not: jest.fn().mockReturnValue({
                  order: jest.fn().mockResolvedValue({
                    data: [MOCK_HIKE], 
                    error: null 
                  })
                })
              })
            })
          })
        }),
      });
      const result = await fetchAvailableHikes(2, "01-01-2025", [2, 3, 4]);
      expect(result).toEqual([MOCK_HIKE]);
      expect(supabase.from).toHaveBeenCalledWith("hikes");
    });

    it("throws an error when Supabase query fails", async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          neq: jest.fn().mockReturnValue({
            neq: jest.fn().mockReturnValue({
              gte: jest.fn().mockReturnValue({
                not: jest.fn().mockReturnValue({
                  order: jest.fn().mockResolvedValue({
                    data: null, 
                    error: "Error" 
                  })
                })
              })
            })
          })
        }),
      });
      await expect(fetchAvailableHikes(2, "01-01-2025", [2, 3, 4])).rejects.toThrow(
        "Failed to fetch hikes to join."
      );
    });
  });
});

describe("Participant functions", () => {
  describe("fetchParticipantsByHike", () => {
    const mockParticipants = [2, 3, 5];
    it("returns participants for the given hike ID", async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: [mockParticipants], error: null }),
        }),
      });
      const result = await fetchParticipantsByHike(5);
      expect(result).toEqual([mockParticipants]);
      expect(supabase.from).toHaveBeenCalledWith("participants");
    });

    it("throws an error when Supabase query fails", async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: null, error: "Error" }),
        }),
      });
      await expect(fetchParticipantsByHike(5)).rejects.toThrow(
        "Failed to fetch participants by hike."
      );
    });
  });

  describe("fetchHikesByParticipant", () => {
    const mockHikes = [2, 3, 5];
    it("returns hikes for the given participant ID", async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: [mockHikes], error: null }),
        }),
      });
      const result = await fetchHikesByParticipant(5);
      expect(result).toEqual([mockHikes]);
      expect(supabase.from).toHaveBeenCalledWith("participants");
    });

    it("throws an error when Supabase query fails", async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: null, error: "Error" }),
        }),
      });
      const result = await fetchHikesByParticipant(5);
      expect(result).toEqual(null);
    });
  });

describe("addParticipant", () => {
  const mockParticipant = {
    user_id: 2,
    hike_id: 5,
  }
    it("adds a new participant successfully", async () => {
      supabase.from.mockReturnValue({
        insert: jest.fn().mockResolvedValue({
            data: [mockParticipant],
            error: null,
          }),
      });
      await expect(addParticipant(2, 5)).resolves.not.toThrow();
      expect(supabase.from).toHaveBeenCalledWith("participants");
    });

    it("throws an error when Supabase query fails", async () => {
      supabase.from.mockReturnValue({
        insert: jest.fn().mockResolvedValue({
            data: null,
            error: "Error",
          }),
      });
      await expect(addParticipant(2, 5)).rejects.toThrow("Failed to add participant.");
    });
  });
  describe("removeParticipant", () => {
    const mockParticipant = {
      user_id: 2,
      hike_id: 5,
    }
      it("removes a new participant successfully", async () => {
        supabase.from.mockReturnValue({
          delete: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
                eq: jest.fn().mockResolvedValue({
                    data: [mockParticipant],
                    error: null,
                  }),
              })
          })
        });
        await expect(removeParticipant(2, 5)).resolves.not.toThrow();
        expect(supabase.from).toHaveBeenCalledWith("participants");
      });
  
      it("throws an error when Supabase query fails", async () => {
        supabase.from.mockReturnValue({
          delete: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                  data: null,
                  error: "Error",
                }),
            })
          })
        });
        await expect(removeParticipant(2, 5)).rejects.toThrow("Failed to remove participant.");
      });
    });
});


