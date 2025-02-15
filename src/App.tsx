import useStore from "./services/user"

const App = (): JSX.Element => {

    const { isFetchingMe, profile, fetchMe } = useStore(state => state)

    const handleClick = async () => {

        await fetchMe(import.meta.env.VITE_API_TOKEN)
    }

    return (
        <div>
            {
                !isFetchingMe && profile && (
                    <div>
                        <p>{profile.name}</p>
                    </div>
                )
            }

            <button onClick={handleClick}>
                get me
            </button>

        </div>
    )
}

export default App