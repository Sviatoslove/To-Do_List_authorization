const authorizationWrapper = document.querySelector('.authorization__wrapper');
const $tasks = document.querySelector('#tasks');

const nameUserWrapper = document.createElement('div');
nameUserWrapper.classList.add('name_current_user_wrapper');

let formAuthButton;
let inputLogin;
let inputPass;

const container = document.createElement('div');
container.classList.add('container');

let registrWrapper;
let formCurrent;
let inputPassConfirm;
let authorization;
let currentLogin;
let currentPassword;
let currentPasswordConfirm;
let modalOverlay;
let labelLogin;
let labelPass;
let userInSystem;

let employ = 'authoriz';

const renderAuthorizationForm = (emplo, bool = false) => {
 let text;
 let class1;
 let class2;
 switch(emplo) {
  case 'registr':
   text = 'Регистрация';
   class1 = ['authoriz', 'Авторизация', 'Зарегистрироваться', 'пароль', 'пароль ещё раз'];
   class2 = ['password', 'Забыли пароль'];
   employ = 'registr';
  break;
  case 'authoriz':
   text = 'Авторизация';
   class1 = ['registr', 'Регистрация', 'Войти', 'пароль'];
   class2 = ['password', 'Забыли пароль'];
   employ = 'authoriz';
  break;
  case 'forgotPass':
   text = 'Замена пароля';
   class1 = ['registr', 'Регистрация', 'Заменить пароль', 'новый пароль', 'новый пароль ещё раз'];
   class2 = ['authoriz', 'Авторизация'];
   employ = 'forgotPass';
  break;
 };
 let templateAdd = `
  <input type="password" class="input_auth_pass_confirm_${emplo}" name="Повторите пароль" style="margin-top: 10px;"placeholder="Введите Ваш ${class1[4]}" required >
 `;
 if(bool) {
  text = 'Теперь войдите в свою учётную запись';
 };
 authorizationWrapper.innerHTML = '';
 const templateform = `
  <div class="form_auth_block_${emplo}">
   <div class="form_auth_block_content_${emplo}">
    <p class="form_auth_block_head_text_${emplo}">${text}</p>
    <form class="form_auth_style_${emplo}" action="#" method="post">
     <label class="label_auth_login_${emplo}">Введите Ваш логин</label>
     <input type="text" class="input_auth_login_${emplo}" name="Логин" placeholder="Введите Ваш логин" required >
     <label class="label_auth_pass_${emplo}">Введите Ваш пароль</label>
     <input type="password" class="input_auth_pass_${emplo}" name="Пароль" placeholder="Введите Ваш ${class1[3]}" required >
     <button class="form_auth_button_${emplo}" type="submit" name="form_auth_submit_${emplo}">${class1[2]}</button>
    </form>
    <div class="registr__wrapper">
     <div class="link_wrapper">
      <a href="#" class="${class1[0]}__link link">${class1[1]}</a>
      <a href="#" class="${class2[0]}__link link">${class2[1]}</a>
     </div>
    </div>
   </div>
  </div>
 `;
 authorizationWrapper.innerHTML = templateform;
 if(emplo === 'registr' || emplo === 'forgotPass') {
  authorizationWrapper.querySelector(`.form_auth_button_${employ}`).before(container);
  authorizationWrapper.querySelector('.container').innerHTML = templateAdd;
  inputPassConfirm = document.querySelector(`.input_auth_pass_confirm_${employ}`);
 }else if(emplo === 'authoriz'){
  authorizationWrapper.querySelector(`.registr__wrapper`).prepend(container);
  templateAdd = `
  <div class="form_wrapper_inSystem">
   <form class="checkbox-form checkbox-form_inSystem">
    <input class="checkbox-form__checkbox checkbox-form__checkbox_inSystem" type="checkbox" name="inSystem" id="789">
    <label class="label_inSystem" for="789"></label>
   </form>
   <span class="task-item__text task-item__text_inSystem">
    Оставаться в системе
   </span>
  </div>
  `;
  authorizationWrapper.querySelector('.container').innerHTML = templateAdd;
 }
 registrWrapper = authorizationWrapper.querySelector('.link_wrapper');
 registrWrapper.addEventListener('click', choiceForm);
 formCurrent = authorizationWrapper.querySelector(`.form_auth_style_${employ}`);
 formAuthButton = formCurrent.querySelector(`.form_auth_button_${employ}`);
 inputLogin = formCurrent.querySelector(`.input_auth_login_${employ}`);
 inputPass = formCurrent.querySelector(`.input_auth_pass_${employ}`);
 formCurrent.addEventListener('click', formControl);
};

renderAuthorizationForm(employ);

let userData;
let userLogin;
let tasks;

if(!localStorage.getItem('authorization')) {
 userData = {};
 tasks = [];
} else {
 userData = JSON.parse(localStorage.getItem('authorization'));
};

class Authorization {
 constructor(userLogin, password, userData) {
  this.userLogin = userLogin;
  this.password = password;
  this.userData = userData;
 };

 getUserData(userLogin) {
  this.userData[userLogin] = {
   userLogin: this.userLogin,
   password: this.password,
   inSystem: false,
   tasks: []
  };
  this.pushToServer()
 };

 pushToServer() {
  localStorage.setItem('authorization', JSON.stringify(this.userData));
 };
};

function choiceForm (event) {
 event.preventDefault();
 const {target} = event;
 if(target.className.includes('registr__link')) renderAuthorizationForm('registr');
 if(target.className.includes('password__link')) renderAuthorizationForm('forgotPass');
 if(target.className.includes('authoriz__link')) renderAuthorizationForm('authoriz');
 formCurrent.addEventListener('input', event => {
  formControl(event)
 });
};

formCurrent.addEventListener('input', event => {
 formControl(event)
});

function formControl (event) {
 event.preventDefault();
 const {target} = event;
 labelLogin = formCurrent.querySelector(`.label_auth_login_${employ}`);
 labelPass = formCurrent.querySelector(`.label_auth_pass_${employ}`);
 currentLogin = inputLogin.value;
 currentPassword = inputPass.value;
 getError(labelLogin, 'Введите Ваш логин', true, 'black');
 getError(labelPass, 'Введите Ваш пароль', true, 'black');
 if(target.className.includes(`form_auth_button_${employ}`)) {
  if(currentLogin === '' && currentPassword === '') {
   getError(labelLogin, 'Логин не может быть пустой строкой...', false);
   getError(labelPass, 'Пароль не может быть пустой строкой...', false);
   return;
  }else if(currentLogin === '') {
   getError(labelLogin, 'Логин не может быть пустой строкой...', false);
   return;
  }else if(currentPassword === '') {
   getError(labelPass, 'Пароль не может быть пустой строкой...', false);
   return;
  };
 };
 searhErrorInsert(target, employ);
 if(target.className.includes('form_auth_button_registr')) {
  if(currentPassword === inputPassConfirm.value) {
   authorization = new Authorization(currentLogin, currentPassword, userData);
   authorization.getUserData(authorization.userLogin);
   renderAuthorizationForm('authoriz', true);
  }else{
   getError(labelPass, 'Не верный второй пароль', false);
  };
 };
 if(target.className.includes('form_auth_button_authoriz')) {
  if(Object.keys(userData).includes(currentLogin) && userData[currentLogin].password === currentPassword) {
   authorizationWrapper.style.transform = `translateY(-100%)`;
   $tasks.style.transform = `translateY(-100%)`;
   const currentTasks = userData[currentLogin].tasks;
   userInSystem = authorizationWrapper.querySelector('.checkbox-form__checkbox_inSystem').hasAttribute('checked');
   userData[currentLogin].inSystem = userInSystem;
   localStorage.setItem('authorization', JSON.stringify(userData));
   getWorkToTasks(currentTasks);
  }else{
   getError(labelPass, 'Не верный логин или пароль пароль', false);
  };
 };
 if(target.className.includes('form_auth_button_forgotPass')) {
  if(currentPassword === inputPassConfirm.value) {
   userData[currentLogin].password = currentPassword;
   localStorage.setItem('authorization', JSON.stringify(userData));
   renderAuthorizationForm('authoriz', true);
  }else{
   getError(labelPass, 'Не верный второй пароль', false);
  };
 };
};

authorizationWrapper.querySelector('.checkbox-form__checkbox_inSystem').addEventListener('click', checkInSystem);

function checkInSystem(event) {
 const {target} = event;
 if(target.hasAttribute('checked')) {
  target.removeAttribute('checked');
 }else {
  target.setAttribute('checked', 'true');
 };
};

function searhErrorInsert(target, employ) {
 if(target.value.length > 0) {
  if(!target.className.includes(`input_auth_pass_confirm_${employ}`)) {
   if(target.value.length < 4) {
    getError(target.previousElementSibling, `${target.name} не может состоять менее, чем из 4-х символов`, false);
    target.onblur = function() {
     if(target.value.length < 4) {
      target.focus();
     };
    };
   }else {
    getError(target.previousElementSibling, `Введите Ваш ${target.name}`, true, 'black');
   };
  };
  
  if(currentLogin.length >= 4 && target.className.includes(`input_auth_login_registr`)) {
   if(Object.keys(userData).includes(inputLogin.value)) {
    getError(labelLogin, 'Такой логин уже занят...', false);
    inputLogin.onblur = function() {
     if(Object.keys(userData).includes(inputLogin.value)){
      inputLogin.focus()
     };
    };
   }else if(currentLogin.length >= 4) {
    getError(labelLogin, 'Логин свободен...')
   };
  };

  if(target.className.includes(`input_auth_pass_confirm_${employ}`)) {
   if(inputPassConfirm.value !== inputPass.value) {
    getError(labelPass, 'Пароли не совпадают...', false);
    inputPassConfirm.onblur = function() {
     if(inputPassConfirm.value !== inputPass.value) {
      getError(labelPass, 'Пароли не совпадают...', false);
      inputPassConfirm.focus();
     };
    };
   }else {
    getError(labelPass, 'Отлично, пароли идентичны...');
   };
  };
 };
};

function getError(elem, text, bool = true, color1 = 'green', color2 = 'red') {
 if(bool) {
  elem.style.color = color1;
  elem.textContent = text;
 }else {
  elem.style.color = color2;
  elem.textContent = text;
 };
};

if(Object.values(userData).some(elem => elem.inSystem)) {
 authorizationWrapper.style.transform = `translateY(-100%)`;
 $tasks.style.transform = `translateY(-100%)`;
 currentLogin = Object.values(userData).find(elem => elem.inSystem).userLogin;
 getWorkToTasks(userData[currentLogin].tasks);
};