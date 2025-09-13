"use client";

import { generateDailyAffirmation } from "@/ai/flows/daily-affirmations-flow";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { HeartHandshake } from "lucide-react";
import React, { useEffect, useState } from "react";

export function DailyAffirmation() {
  const [affirmation, setAffirmation] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getAffirmation() {
      try {
        setLoading(true);
        const result = await generateDailyAffirmation({});
        setAffirmation(result.affirmation);
      } catch (error) {
        console.error("Failed to generate affirmation:", error);
        setAffirmation("Embrace your power and shine brightly today.");
      } finally {
        setLoading(false);
      }
    }
    getAffirmation();
  }, []);

  return (
    <Card className="bg-accent/30 border-accent/50 shadow-md">
      <CardContent className="p-4 flex items-center gap-4">
        <HeartHandshake className="h-8 w-8 text-accent-foreground flex-shrink-0" />
        {loading ? (
          <Skeleton className="h-5 w-3/4 bg-foreground/10" />
        ) : (
          <p className="text-sm md:text-base font-medium text-accent-foreground">
            {affirmation}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
