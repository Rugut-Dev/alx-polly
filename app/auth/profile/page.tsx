import { ProfileForm } from "@/components/auth/profile-form"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Profile Settings
            </h1>
            <ProfileForm />
          </div>
        </div>
      </div>
    </div>
  )
}