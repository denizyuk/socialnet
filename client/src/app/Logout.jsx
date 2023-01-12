export default function Logout() {
    function handleLogut() {
        fetch("/logout")
            .then((res) => res.json())
            .then(() => {
                history.push("/login");
                window.location.reload();
            });
    }
    return (
        <>
            <div className="logout-btn" onClick={handleLogut}>
                Log Out
            </div>
        </>
    );
}
