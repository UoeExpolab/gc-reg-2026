"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect, Option } from "@/components/ui/multi-select";

interface TimeSlot {
  id: string;
  name: string;
}

export default function BookingForm() {
  const [teams, setTeams] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [inventory, setInventory] = useState<Option[]>([]);
  
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedInventoryIds, setSelectedInventoryIds] = useState<string[]>([]);
  
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState("");
  
  const [isLoadingForm, setIsLoadingForm] = useState(true);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch initial form data
  useEffect(() => {
    async function fetchFormData() {
      try {
        const [resTeams, resInventory, resChallenges] = await Promise.all([
          fetch("/api/teams"),
          fetch("/api/inventory"),
          fetch("/api/challenges")
        ]);
        
        if (resTeams.ok) setTeams((await resTeams.json()).teams || []);
        if (resChallenges.ok) setChallenges((await resChallenges.json()).challenges || []);
        if (resInventory.ok) {
          const data = await resInventory.json();
          setInventory((data.inventory || []).map((i: any) => ({ label: i.name, value: i.id })));
        }
      } catch (error) {
        toast.error("Error loading form data");
      } finally {
        setIsLoadingForm(false);
      }
    }
    fetchFormData();
  }, []);

  const selectedTeam = useMemo(() => teams.find(t => t.id === selectedTeamId), [teams, selectedTeamId]);
  const teamChallengeName = useMemo(() => {
    if (!selectedTeam || !selectedTeam.challenge || selectedTeam.challenge.length === 0) return "N/A";
    const cId = selectedTeam.challenge[0];
    return challenges.find(c => c.id === cId)?.name || "Unknown";
  }, [selectedTeam, challenges]);

  // Fetch available time slots when inventory selection changes
  useEffect(() => {
    if (selectedInventoryIds.length === 0) {
      setTimeSlots([]);
      setSelectedTimeSlotId("");
      return;
    }

    async function fetchAvailability() {
      setIsLoadingTimeSlots(true);
      setSelectedTimeSlotId(""); // Reset time slot on new item selection
      try {
        const res = await fetch(`/api/availability?itemIds=${selectedInventoryIds.join(",")}`);
        const data = await res.json();
        if (res.ok) {
          setTimeSlots(data.availableTimeSlots || []);
        } else {
          toast.error("Failed to load time slots");
        }
      } catch (error) {
        toast.error("Error checking availability");
      } finally {
        setIsLoadingTimeSlots(false);
      }
    }
    
    // Simple debounce to prevent excessive fetching while clicking multiple items
    const timeoutId = setTimeout(() => {
      fetchAvailability();
    }, 300);
    return () => clearTimeout(timeoutId);
    
  }, [selectedInventoryIds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTeamId || selectedInventoryIds.length === 0 || !selectedTimeSlotId) {
      toast.error("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: selectedTeamId,
          inventoryIds: selectedInventoryIds,
          timeSlotId: selectedTimeSlotId,
        }),
      });

      if (res.ok) {
        toast.success("Kit reserved successfully!");
        setSelectedTeamId("");
        setSelectedInventoryIds([]);
        setSelectedTimeSlotId("");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to make reservation");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingForm) return <div className="text-center py-8 text-gray-400"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label className="text-gray-300">Team <span className="text-red-400">*</span></Label>
        <Select value={selectedTeamId} onValueChange={(val) => setSelectedTeamId(val || "")} required>
          <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-indigo-500">
            <SelectValue placeholder="Select your team">
              {selectedTeamId ? teams.find(t => t.id === selectedTeamId)?.name : undefined}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-neutral-900 border-white/10 text-white">
            {teams.map((t) => (
              <SelectItem key={t.id} value={t.id} className="focus:bg-indigo-600 focus:text-white">{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedTeam && (
        <div className="p-4 bg-white/5 rounded-md border border-white/10 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-500 text-xs">Project Name</Label>
              <div className="text-sm text-gray-200">{selectedTeam.project || "N/A"}</div>
            </div>
            <div>
              <Label className="text-gray-500 text-xs">Group Number</Label>
              <div className="text-sm text-gray-200">{selectedTeam.group || "N/A"}</div>
            </div>
            <div className="col-span-2">
              <Label className="text-gray-500 text-xs">Challenge</Label>
              <div className="text-sm text-gray-200">{teamChallengeName}</div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-gray-300">Inventory Items (Kits) <span className="text-red-400">*</span></Label>
        <MultiSelect
          options={inventory}
          selected={selectedInventoryIds}
          onChange={setSelectedInventoryIds}
          placeholder="Select items to borrow..."
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Day/Time Slot <span className="text-red-400">*</span></Label>
        <Select
          value={selectedTimeSlotId}
          onValueChange={(val) => setSelectedTimeSlotId(val || "")}
          disabled={selectedInventoryIds.length === 0 || isLoadingTimeSlots || timeSlots.length === 0}
          required
        >
          <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-indigo-500">
            <SelectValue
              placeholder={
                selectedInventoryIds.length === 0
                  ? "Select items first"
                  : isLoadingTimeSlots
                  ? "Checking availability..."
                  : timeSlots.length === 0
                  ? "No slots available for these items"
                  : "Select a time slot"
              }
            >
              {selectedTimeSlotId ? timeSlots.find(slot => slot.id === selectedTimeSlotId)?.name : undefined}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-neutral-900 border-white/10 text-white">
            {timeSlots.map((slot) => (
              <SelectItem key={slot.id} value={slot.id} className="focus:bg-indigo-600 focus:text-white">
                {slot.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !selectedTeamId || selectedInventoryIds.length === 0 || !selectedTimeSlotId}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all duration-200"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Reserving...
          </>
        ) : (
          "Reserve Kit"
        )}
      </Button>
    </form>
  );
}
