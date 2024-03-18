<template>
    <div>
        <Message :msg="msg" :msgClass="msgClass" />
        <form id="login-form" @submit="login($event)">
            <div class="input-container">
                <label for="email">Email:</label>
                <input type="email" name="email" id="email" v-model="email" placeholder="Digite o seu e-mail">
            </div>
            <div class="input-container">
                <label for="password">Senha:</label>
                <input type="password" name="password" id="password" v-model="password"
                    placeholder="Digite a sua senha">
            </div>
            <InputSubmit v-text="Entrar" />
        </form>
    </div>
</template>

<script>
import Message from './Message.vue'
import InputSubmit from './form/InputSubmit.vue'

export default {
    name: "LoginForm",
    components: {
        Message,
        InputSubmit
    },
    data() {
        return {
            email: null,
            password: null,
            msg: null,
            msgClass: null
        }
    },
    methods: {
        async login(e) {
    e.preventDefault();

    // Verificar se o campo de senha está vazio
    if (!this.password) {
        this.msg = "Por favor, insira sua senha.";
        this.msgClass = "error";
        return;
    }

    const data = {
        email: this.email,
        password: this.password
    }

    const jsonData = JSON.stringify(data);

    try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: jsonData
        });

        const responseData = await response.json();

        if (response.ok) {
            // Se a resposta for bem-sucedida, realizar as ações necessárias
            this.msg = responseData.msg;
            this.msgClass = "success";

            // Emitir evento para salvar usuário
            this.$store.commit("authenticate", { token: responseData.token, userId: responseData.userId });

            setTimeout(() => {
                // Redirecionar para o dashboard após 2 segundos
                this.$router.push("dashboard");
            }, 2000);
        } else {
            // Se a resposta não for bem-sucedida, exibir mensagem de erro
            this.msg = responseData.error || "Erro ao efetuar login.";
            this.msgClass = "error";
        }
    } catch (error) {
        console.error("Erro ao efetuar login:", error);
        this.msg = "Erro ao efetuar login. Por favor, tente novamente mais tarde.";
        this.msgClass = "error";
    }
        }}
}
</script>

<style scoped>
#login-form {
    max-width: 400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
}

.input-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
    text-align: left;

}

.input-container label {
    margin-bottom: 10px;
    color: #555;
}

.input-container input {
    padding: 10px;
    border: 1px solid#e8e8e8;
}
</style>