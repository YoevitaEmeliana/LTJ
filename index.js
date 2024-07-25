document.addEventListener('DOMContentLoaded', function() {
    const nextButton = document.querySelector('.next');
    const prevButton = document.querySelector('.prev ');
    const contentText = document.querySelector('#home .content p');

    nextButton.addEventListener('click', function() {
        contentText.textContent = 'NAMA WEBSITE dibuat dalam bentuk web untuk memudahkan ...';
    });

    prevButton.addEventListener('click', function() {
        contentText.textContent = 'Kami dapat membantu Anda untuk mengetahui nilai prediksi pendapatan dan pertumbuhan ekonomi suatu wilayah melalui data';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const mulaiButton = document.querySelector('.action-btn.mulai');
    const pelajariButton = document.querySelector('.action-btn.pelajari');

    mulaiButton.addEventListener('click', function() {
        document.getElementById('pertumbuhan').scrollIntoView({ behavior: 'smooth' });
    });

    pelajariButton.addEventListener('click', function() {
        document.getElementById('tentang').scrollIntoView({ behavior: 'smooth' });
    });
});

