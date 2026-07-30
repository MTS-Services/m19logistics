const ProfileHeader = ({ displayRole = 'Contractor', tradingName }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Profile</h1>
      <p className="mt-2 text-gray-600">
        Manage your {displayRole.toLowerCase()} details
        {tradingName ? ` — ${tradingName}` : ''}
      </p>
    </div>
  );
};

export default ProfileHeader;
