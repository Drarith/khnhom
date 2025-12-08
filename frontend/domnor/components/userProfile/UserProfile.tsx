import { ProfileData } from "@/types/profileData";
import Image from "next/image";

export default function UserProfile({ data }: { data: ProfileData }) {
  const backgorund = "primary"
  return (
    <div className="min-h-screen bg-accent">
      <div className="relative w-full">
        <div className="relative w-full h-96 md:h-[500px]">
          <Image 
            src={data.profilePictureUrl} 
            alt="profile picture" 
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Gradient Overlay - Fades to background color */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-accent" />
        
        {/* Optional: Stronger fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-accent to-transparent" />
      </div>

      
      <div className="relative -mt-20 px-4">
        <h1 className="text-2xl font-bold text-center">
          {data.displayName}
        </h1>
      </div>
    </div>
  );
}