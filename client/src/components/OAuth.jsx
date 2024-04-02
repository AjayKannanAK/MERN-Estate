import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

//note here we have specifically added type="button". If we didn't add this then like SIGN UP/SIGN IN buton it will also submit formdata.
//To prevent this we have added this. For this we will add onClick handler and do the google auth logic
//note its default type is submit
export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth, provider)

            console.log(result);

            const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL
                })
            });

            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate("/");
        } catch (error) {
            console.log('Unable to sign in with google', error);
        }
    }

    return (
        <button type="button" onClick={handleGoogleClick} className="bg-red-700 text-white p-3 rounded-lg hover:opacity-90 uppercase">Continue With Google</button>
    )
}


