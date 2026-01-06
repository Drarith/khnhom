import { UserPlus, Search } from 'lucide-react';
import Link from 'next/link';

const ProfileNotFound = ({ username = "wizard_of_oz" }) => {


  return (
    <div className="flex items-center justify-center w-full p-4 font-sans">
      
      {/* Card Container */}
      <div className="relative w-full max-w-lg p-8 mx-auto bg-white border border-gray-100 shadow-2xl rounded-2xl shadow-gray-200/50">
        
        {/* Decorative Background Elements (Subtle) */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary-50 rounded-full blur-2xl opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-purple-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

        <div className="relative flex flex-col items-center text-center">
          
          {/* Icon Composition */}
          <div className="relative mb-6 group">
            <div className="absolute inset-0 bg-primary-100 rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-50 to-white border border-primary-100 rounded-full shadow-sm">
              <Search className="w-8 h-8 text-primary-300 absolute -left-1 top-2" strokeWidth={2.5} />
              <div className="bg-white p-2 rounded-full border border-gray-100 shadow-sm z-10">
                <UserPlus className="w-8 h-8 text-primary-600" strokeWidth={2} />
              </div>
            </div>
            
          </div>

          {/* Text Content */}
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
            Profile not found
          </h2>
          
          <p className="text-gray-500 text-lg mb-6 leading-relaxed max-w-sm">
            It looks like <span className="font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded text-base mx-1">@{username}</span> 
            hasn&apos;t been claimed yet.
          </p>

          {/* Availability Badge */}
          <div className="flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium text-green-700 bg-green-50 border border-green-100 rounded-full">
            <span className="relative flex w-2.5 h-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            Username Available
          </div>

          {/* Actions */}
          <div className="flex flex-col w-full gap-3 sm:flex-row">
            <Link
              href="/" 
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white transition-all duration-200 bg-primary rounded-xl shadow-lg shadow-primary-200  hover:shadow-primary-300 focus:ring-4 focus:ring-primary-100 active:transform active:scale-95"
            >
              <UserPlus className="w-5 h-5" />
              Claim @{username}
            </Link>
            

          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileNotFound;