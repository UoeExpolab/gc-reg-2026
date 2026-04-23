import BookingForm from "@/components/booking-form";
import TeamRegistrationForm from "@/components/team-registration-form";
import TableReservationForm from "@/components/table-reservation-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-xl space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
            Hackathon Hub
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-sm mx-auto">
            Register your team, book a table, or reserve hardware kits.
          </p>
        </div>

        {/* Forms Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative gradients */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <Tabs defaultValue="team" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-black/20 p-1 rounded-xl mb-6">
                <TabsTrigger value="team" className="rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all text-gray-300">Team</TabsTrigger>
                <TabsTrigger value="table" className="rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all text-gray-300">Table</TabsTrigger>
                <TabsTrigger value="kit" className="rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all text-gray-300">Kit</TabsTrigger>
              </TabsList>
              
              <TabsContent value="team" className="mt-0 outline-none">
                <TeamRegistrationForm />
              </TabsContent>
              <TabsContent value="table" className="mt-0 outline-none">
                <TableReservationForm />
              </TabsContent>
              <TabsContent value="kit" className="mt-0 outline-none">
                <BookingForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Footer info */}
        <div className="text-center text-xs text-gray-500">
          <p>Need help? Contact a hackathon organizer.</p>
        </div>
      </div>
    </main>
  );
}
