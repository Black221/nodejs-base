import validator from "../utils/integrety.utils.js"

const validateRegister = (req, res, next) => {
    const { email, phone, countryCode, username, password } = req.body;

    if ((!email && !phone) || !password || !username || !countryCode){
        return res.status(400).json({ message: "Please provide email, phone, username, country code and password", data: null });
    }

    // Data integrity check and validation
    let invalid = [];
    if (email !== undefined && !validator.isEmail(email)) {
        invalid.push("invalid email");
    }

    if (phone && !validator.isPhone(phone)) {
        invalid.push("invalid phone");
    }

    // Check if username length is less than 3
    if (username.length < 3) {
        invalid.push("username must be at least 3 characters long");
    }

    // No injection check
    if (validator.hasInjection(username) || validator.hasInjection(password) || validator.hasInjection(email)
        || validator.hasInjection(phone)) {
        invalid.push("invalid characters");
    }

    if (invalid.length > 0) {
        return res.status(400).json({ message: `errors : ${invalid.join(", ")}!`, data: null });
    }
    next();
}

const validateLogin = (req, res, next) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ message: "Please provide login and password", err: "log-1" });
    }

    // No injection check
    if (validator.hasInjection(login) || validator.hasInjection(password)) {
        return res.status(400).json({ message: "Invalid login or password", err: "log-2" });
    }

    // Check if login is email or phone
    let isEmail = validator.isEmail(login);
    let isPhone = validator.isPhone(login);

    if (!isEmail && !isPhone) {
        return res.status(400).json({ message: "Login should be email or password", err: "log-3" });
    }

    next();
}

export default {
    validateRegister,
    validateLogin
}