"use client"

import { useParams } from "next/navigation";

export default function UserProfilePage() {
    const { locale, userProfile } = useParams();
    return (
        <div>
            <h1>User Profile Page</h1>
            <p>Locale: {locale}</p>
            <p>User Profile: {userProfile}</p>
        </div>
    );
}
