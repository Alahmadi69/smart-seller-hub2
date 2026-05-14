const firebaseConfig = {
    apiKey: "AIzaSyBSwUJDADe_xlmcKYB51i8OsQWAZmzOz_sn3i",
    authDomain: "smarthub-e7c18.firebaseapp.com",
    projectId: "smarthub-e7c18",
    storageBucket: "smarthub-e7c18.firebasestorage.app",
    messagingSenderId: "654281038765",
    appId: "1:654281038765:web:f495ea89fec4d462b6df24"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
let isSignUp = false;

const errorMessages = {
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password is too weak.',
    'auth/popup-closed-by-user': 'Sign-in window was closed.',
    'auth/operation-not-allowed': 'Google sign-in is not enabled.'
};

document.getElementById('authForm').addEventListener('submit', handleSubmit);
document.getElementById('googleBtn').addEventListener('click', signInWithGoogle);
document.getElementById('toggleLink').addEventListener('click', toggleMode);

function toggleMode(e) {
    e.preventDefault();
    isSignUp = !isSignUp;

    const nameField = document.getElementById('nameField');
    const submitBtn = document.getElementById('submitBtn');
    const toggleText = document.getElementById('toggleText');
    const toggleLink = document.getElementById('toggleLink');
    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');

    if (isSignUp) {
        submitBtn.textContent = 'Create Account';
        toggleText.textContent = 'Already have an account?';
        toggleLink.textContent = 'Sign In';
        pageTitle.textContent = 'Create an Account';
        pageSubtitle.textContent = 'Sign up to start using Smarthub.';
        nameField.classList.remove('form-field-hidden');
    } else {
        submitBtn.textContent = 'Sign In';
        toggleText.textContent = "Don't have an account?";
        toggleLink.textContent = 'Sign Up';
        pageTitle.textContent = 'Welcome Back';
        pageSubtitle.textContent = 'Sign in to access your dashboard.';
        nameField.classList.add('form-field-hidden');
    }
    clearError();
}

function handleSubmit(e) {
    e.preventDefault();
    clearError();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const fullName = document.getElementById('fullName').value.trim();

    if (!email || !password) {
        showError('Please enter email and password.');
        return;
    }

    if (isSignUp) {
        if (!fullName) {
            showError('Please enter your full name.');
            return;
        }
        if (password.length < 8) {
            showError('Password must be at least 8 characters.');
            return;
        }
        signUp(email, password, fullName);
    } else {
        signIn(email, password);
    }
}

function signUp(email, password, fullName) {
    auth.createUserWithEmailAndPassword(email, password)
        .then(result => result.user.updateProfile({ displayName: fullName }).then(() => result.user))
        .then(user => saveSession(fullName, user.email))
        .catch(error => showError(getMessage(error.code)));
}

function signIn(email, password) {
    auth.signInWithEmailAndPassword(email, password)
        .then(result => saveSession(result.user.displayName || email, result.user.email))
        .catch(error => showError(getMessage(error.code)));
}

function signInWithGoogle() {
    clearError();
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(result => saveSession(result.user.displayName, result.user.email))
        .catch(error => showError(getMessage(error.code)));
}

function saveSession(name, email) {
    const session = {
        username: name,
        email,
        loginTime: new Date().toLocaleString(),
        loggedIn: true
    };
    localStorage.setItem('userSession', JSON.stringify(session));
    window.location.href = 'dashboard.html';
}

function getMessage(code) {
    return errorMessages[code] || 'Something went wrong. Please try again.';
}

function showError(msg) {
    const box = document.getElementById('auth-error-message');
    box.textContent = msg;
    box.classList.add('show');
}

function clearError() {
    document.getElementById('auth-error-message').classList.remove('show');
}
