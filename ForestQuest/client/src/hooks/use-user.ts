import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState, useEffect } from "react";
import type { User, InsertUser } from "@shared/schema";

// Demo user for testing - in a real app this would come from authentication
const DEMO_USER_ID = "c446ec6b-71ca-4bdb-a36c-825ea09e93d2"; // Use the existing user ID

export function useUser() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasSkipped, setHasSkipped] = useState(false);
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/users', DEMO_USER_ID],
    retry: false,
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: InsertUser) => {
      const response = await apiRequest('POST', '/api/users', {
        ...userData,
        id: DEMO_USER_ID, // Use consistent ID
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', DEMO_USER_ID] });
    },
  });

  // Initialize demo user if it doesn't exist and user hasn't skipped
  useEffect(() => {
    if (!isLoading && !user && !isInitialized && !hasSkipped) {
      setIsInitialized(true);
      createUserMutation.mutate({
        username: "forest_guardian",
        email: "demo@forestquest.com",
        level: 7,
        experience: 750,
        hitPoints: 85,
        streak: 12,
        treeStage: 7,
      });
    }
  }, [isLoading, user, isInitialized, hasSkipped, createUserMutation]);

  const skipAccountCreation = () => {
    setHasSkipped(true);
    setIsInitialized(true);
  };

  return {
    user,
    isLoading: isLoading || createUserMutation.isPending,
    createUser: createUserMutation.mutate,
    isCreatingUser: createUserMutation.isPending,
    hasSkipped,
    skipAccountCreation,
  };
}
