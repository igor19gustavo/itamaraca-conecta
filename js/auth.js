(() => {
    const USERS_KEY = "itamaracaUsers";
    const SESSION_KEY = "itamaracaCurrentUser";
    const loginTab = document.querySelector("#login-tab");
    const registerTab = document.querySelector("#register-tab");
    const loginForm = document.querySelector("#login-form");
    const registerForm = document.querySelector("#register-form");
    const message = document.querySelector("#auth-message");

    function getUsers() {
        try {
            const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
            return Array.isArray(users) ? users : [];
        } catch {
            return [];
        }
    }

    function showMessage(text, type = "info") {
        message.textContent = text;
        message.className = `auth-message visible ${type}`;
    }

    function switchTab(tab) {
        const showLogin = tab === "login";
        loginForm.hidden = !showLogin;
        registerForm.hidden = showLogin;
        loginTab.classList.toggle("active", showLogin);
        registerTab.classList.toggle("active", !showLogin);
        loginTab.setAttribute("aria-selected", String(showLogin));
        registerTab.setAttribute("aria-selected", String(!showLogin));
        message.textContent = "";
        message.className = "auth-message";
    }

    async function hashPassword(password, salt) {
        if (!window.crypto || !window.crypto.subtle) {
            throw new Error("Abra o projeto pelo VS Code usando o Live Server (localhost) para habilitar a função de proteção da senha.");
        }
        const bytes = new TextEncoder().encode(`${salt}:${password}`);
        const digest = await window.crypto.subtle.digest("SHA-256", bytes);
        return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
    }

    function makeSalt() {
        if (window.crypto && window.crypto.getRandomValues) {
            const values = new Uint8Array(16);
            window.crypto.getRandomValues(values);
            return Array.from(values, byte => byte.toString(16).padStart(2, "0")).join("");
        }
        return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }

    loginTab.addEventListener("click", () => switchTab("login"));
    registerTab.addEventListener("click", () => switchTab("register"));

    registerForm.addEventListener("submit", async event => {
        event.preventDefault();
        const name = document.querySelector("#register-name").value.trim();
        const username = document.querySelector("#register-username").value.trim();
        const password = document.querySelector("#register-password").value;
        const confirmation = document.querySelector("#register-password-confirm").value;

        if (password !== confirmation) {
            showMessage("As senhas não coincidem. Confira os dois campos.", "error");
            return;
        }

        const users = getUsers();
        if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
            showMessage("Esse nome de usuário já está cadastrado. Escolha outro ou entre na sua conta.", "error");
            return;
        }

        try {
            const salt = makeSalt();
            const passwordHash = await hashPassword(password, salt);
            const user = {
                id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                name,
                username,
                usernameLower: username.toLowerCase(),
                salt,
                passwordHash,
                bio: "",
                avatar: "",
                visitedSpots: [],
                createdAt: new Date().toISOString()
            };
            users.push(user);
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
            localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, username: user.username }));
            showMessage("Conta criada! Vamos voltar para a página inicial.", "success");
            window.setTimeout(() => { window.location.href = "index.html"; }, 700);
        } catch (error) {
            showMessage(error.message || "Não foi possível criar a conta neste navegador.", "error");
        }
    });

    loginForm.addEventListener("submit", async event => {
        event.preventDefault();
        const username = document.querySelector("#login-username").value.trim();
        const password = document.querySelector("#login-password").value;
        const user = getUsers().find(item => item.username.toLowerCase() === username.toLowerCase());

        if (!user) {
            showMessage("Conta não encontrada. Confira os dados ou crie uma conta.", "error");
            return;
        }

        try {
            const passwordHash = await hashPassword(password, user.salt);
            if (passwordHash !== user.passwordHash) {
                showMessage("Senha incorreta. Tente novamente.", "error");
                return;
            }
            localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, username: user.username }));
            showMessage("Login realizado! Redirecionando...", "success");
            window.setTimeout(() => { window.location.href = "index.html"; }, 500);
        } catch (error) {
            showMessage(error.message || "Não foi possível entrar nesta conta.", "error");
        }
    });
})();
