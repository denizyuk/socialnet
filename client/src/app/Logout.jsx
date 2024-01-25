export default function Logout() {
    function handleLogut() {
        fetch("/logout")
            .then((res) => res.json())
            .then(() => {
                history.push("/Login");
                window.location.reload();
            });
    }
    return (
        <>
            <div className="logout-btn" onClick={handleLogut}>
                <button> Log Out </button>
            </div>
        </>
    );
}
//
