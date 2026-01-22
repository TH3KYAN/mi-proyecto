/**
 * Este archivo simula una conexión a una base de datos.
 * En el futuro, aquí es donde configurarías Prisma, Kysely, o fetch para tu API.

export const db = {
    patients: {
        findMany: async () => {
            // Simula una latencia de red
            await new Promise(resolve => setTimeout(resolve, 100));
            return [
                { id: '1', name: "John Doe" },
                { id: '2', name: "Maria Garcia" },
                { id: '3', name: "David Johnson" }
            ];
        }
    },
    reports: {
        generate: async (query) => {
            console.log("Simulando consulta a DB para reporte:", query);
            return {
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date().toISOString()
            };
        }
    }
};

            */