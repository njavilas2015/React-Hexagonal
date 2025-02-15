import { useEffect } from "react"
import useStore from "./services/user"

const App = (): JSX.Element => {

    const isFetchingMe = useStore(state => state.isFetchingMe)

    const profile = useStore(state => state.profile)

    const fetchMe = useStore(state => state.fetchMe)

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