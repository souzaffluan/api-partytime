<template>
    <div class="dashboard">
        <div class="title-container">
            <h1>Gerencie seus eventos</h1>
            <router-link to="/newparty" class="btn">Cadastrar Festa</router-link>
        </div>
        <div v-if="parties.length > 0">
            <h1>Tabela de festa</h1>
        </div>
        <div v-else>
            <p>Você ainda não tem festas cadastradas, <router-link to="/newparty">clique aqui para criar a sua festa</router-link></p>
        </div>
    </div>    
</template>

<script>
export default{
    data(){
        return{
            parties:[]
        }
    }

}
</script>

<style scoped>

.dashboard{
    padding: 50px;
    padding-bottom: 100px;
}

.title-container{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40px;
}

.btn {
    padding: 10px 16px;
    background-color: #000;
    color: #FFF;
    text-decoration: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    transition: .5s;
}

.btn:hover{
    background-color: #141619;
}
</style>