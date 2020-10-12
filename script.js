window.addEventListener('DOMContentLoaded', function() {
    
    // Form

    // создаем переменную в которой будет лежать объект с сообщениями о текущем состоянии запроса
    let messages = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с вами свяжемся!',
        failure: 'Что-то пошло не так...'
    };

    // получаем форму, инпуты в форме, создаем блок div и присваиваем ему класс status
    let form = document.querySelector('.main-form'),
        input = form.getElementsByTagName('input'), // через вложенность получим только инпуты лежащие в main-form
        statusMessage = document.createElement('div');

    statusMessage.classList.add('status');

    // обработчик события вешается на форму с событием submit, это событие сработает только тогда, когда наша
    // форма отправляется, ошибкой будет повешать событие на кнопку, которая имеет type="submit" или это button
    // т.к. нужно отслеживать отправку формы на сервер
    form.addEventListener('submit', function(event) {
        event.preventDefault();     // отмена стандартного поведени браузера
        form.appendChild(statusMessage);
        
        let request = new XMLHttpRequest(); // создаем конструктор с объектом запроса XMLHttpRequest
        request.open('POST', 'server.php'); // настраиваем запрос 'POST' отправка данных 'server.php'- это url
        /* request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); // настраиваем заголовки http запроса */
        // если отправляем в JSON формате заголовок выгдядит так
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8'); 

        // получаем данные которые ввел пользователь в input при помощи объекта FormData, который сформирует ключ: значение;
        // в верстве в инпутах обязательно должен быть атрибут name, с него формируется ключ
        let formData = new FormData(form); // form это форма с которой мы хотим достать данные отправленые пользователем

        // чтобы преобоазовать данные с формы в JSON формат 
        // создаем пустой объект (промежуточный), чтобы его заполнить данными, которые есть в formData, используем цикл forEach
        let obj = {}; 
        formData.forEach(function(value, key) { 
            obj[key] = value;
        });
        // при помощи метода stringify(obj) превращаем обычный JS обект в JSON формат
        let json = JSON.stringify(obj);
        
        request.send(json); // отправляем тело в JSON формате

        /* request.send(formData); // отправляем данные на сервер с body (телом) formData, т.к. используется метод POST */

        // вешаем обработчик события на запрос request и отслеживаем его состояние при помощи события readystatechange
        request.addEventListener('readystatechange', function() {
            if (request.readyState < 4) {   // при помощи свойства readyState объекта XMLHttpRequest узнаем состояние если < 4
                statusMessage.innerHTML = messages.loading; // вставлям текст с объекта messages, свойства loading
            } else if (request.readyState === 4 && request.status == 200) {
                statusMessage.innerHTML = messages.success;
            } else {
                statusMessage.innerHTML = messages.failure;
            }
        });

        for (let i = 0; i < input.length; i++) {    // очищаем формы после всего выполненого кода 
            input[i].value = '';                    // значение value становиться пустым
        }
    });
});
