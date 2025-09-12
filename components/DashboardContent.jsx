export default function DashboardContent({initialData, user}){
  return(
    <div className="mt-6">
      User Dashboard Section for user {user.profile?.name}
    </div>
  );
}