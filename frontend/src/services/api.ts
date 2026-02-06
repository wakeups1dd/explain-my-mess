const API_URL = 'http://localhost:3000';

export async function explainText(text: string, file: File | null): Promise<string> {
    const formData = new FormData();
    formData.append('text', text);
    if (file) {
        formData.append('image', file);
    }

    const response = await fetch(`${API_URL}/api/explain`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get explanation');
    }

    const data = await response.json();
    return data.result;
}
