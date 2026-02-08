import axios from "axios";

export const keycloakApi  = axios.create({
    baseURL: `http://localhost:8080/realms/poc`,
})
