console.log('Akwadra Super Builder Initialized');

document.addEventListener('DOMContentLoaded', () => {
    const card = document.querySelector('.card');
    card.addEventListener('click', () => {
        console.log('تم النقر على البطاقة!');
        alert('أهلاً بك في عالم البناء بدون كود!');
    });
});

async function testValidation() {
    const resultDiv = document.getElementById('result');
    const resultContent = document.getElementById('resultContent');
    
    resultDiv.classList.remove('hidden');
    resultContent.textContent = 'جاري الاختبار...';
    
    try {
        const testData = {
            email: 'test@example.com',
            username: 'testuser',
            age: 25
        };
        
        const response = await fetch('/api/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });
        
        const data = await response.json();
        resultContent.textContent = JSON.stringify(data, null, 2);
        
        if (response.ok) {
            resultDiv.classList.add('border-green-300', 'bg-green-50');
            resultDiv.classList.remove('border-red-300', 'bg-red-50');
        } else {
            resultDiv.classList.add('border-red-300', 'bg-red-50');
            resultDiv.classList.remove('border-green-300', 'bg-green-50');
        }
    } catch (error) {
        resultContent.textContent = `خطأ: ${error.message}`;
        resultDiv.classList.add('border-red-300', 'bg-red-50');
        resultDiv.classList.remove('border-green-300', 'bg-green-50');
    }
}