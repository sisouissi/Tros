
export const generateSummary = async (prompt: string): Promise<string> => {
    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.error || `Le serveur a répondu avec le statut ${response.status}`;
            throw new Error(errorMessage);
        }

        if (typeof data.text !== 'string') {
             throw new Error("La réponse du serveur est malformée.");
        }

        return data.text;
    } catch (error) {
        console.error("Erreur lors de la communication avec le service backend:", error);
        const message = error instanceof Error ? error.message : 'Erreur inconnue.';
        return `Une erreur est survenue lors de la communication avec l'assistant IA. Détails: ${message}`;
    }
};
