class peopleTable {
  constructor() {
    this.people = [];
    this.idCounter = 0;
  }

  addNewPerson(name, surname, email) {
    const date = new Date();
    const person = {
      id: ++this.idCounter,
      name,
      surname,
      email,
      date: `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`,
      selected: false,
      editing: false,
    };

    this.people.push(person);
    this.render();
  }

  createTableRow({ id, name, surname, email, date, selected, editing }) {
    if (editing) return this.createEditingRow(name, surname, email, date);

    const row = document.createElement('tr');
    const Name = document.createElement('td');
    const Surname = document.createElement('td');
    const Email = document.createElement('td');
    const Date = document.createElement('td');

    Name.textContent = name;
    Surname.textContent = surname;
    Email.textContent = email;
    Date.textContent = date;

    row.className = `row ${selected ? 'selectedRow' : ''}`;
    Name.className = 'column';
    Surname.className = 'column';
    Email.className = 'column';
    Date.className = 'column';


    row.addEventListener('click', (event) => this.rowClick(event, id));
    row.addEventListener('dblclick', (event) => this.rowDbClick(event, id));
    row.append(Name, Surname, Email, Date);

    return row;
  }

  createEditingRow(name, surname, email, date) {
    const row = document.createElement('tr');
    const nameCol = document.createElement('td');
    const surnameCol = document.createElement('td');
    const emailCol = document.createElement('td');
    const dateCol = document.createElement('td');

    const nameInput = document.createElement('input');
    const surnameInput = document.createElement('input');
    const emailInput = document.createElement('input');

    nameInput.id = 'editName';
    surnameInput.id = 'editSurname';
    emailInput.id = 'editEmail';

    nameInput.value = name;
    surnameInput.value = surname;
    emailInput.value = email;

    nameCol.className = 'column';
    surnameCol.className = 'column';
    emailCol.className = 'column';
    dateCol.className = 'column';

    nameCol.appendChild(nameInput);
    surnameCol.appendChild(surnameInput);
    emailCol.appendChild(emailInput);
    dateCol.textContent = date;

    row.append(nameCol, surnameCol, emailCol, dateCol);

    return row;
  }

  rowClick(event, id) {
    const person = this.people.find(person => person.id === id);

    person.selected = !person.selected;
    this.render();
  }

  rowDbClick(event, id) {
    this.people.forEach(person => person.editing = person.id === id);

    this.render();
  };

  render() {
    const tBody = document.querySelector('.tableContent');
    const rows = this.people.map(person => this.createTableRow(person));

    tBody.innerHTML = '';
    tBody.append(...rows);
  }

  formSubmit(event) {
    const nameInput = document.querySelector('#name');
    const surnameInput = document.querySelector('#surname');
    const emailInput = document.querySelector('#email');

    event.preventDefault();

    if (!this.validateEmail(emailInput.value)) {
      alert('You entered not correct email, please try again!');
      return;
    }

    this.addNewPerson(nameInput.value, surnameInput.value, emailInput.value);
    nameInput.value = '';
    surnameInput.value = '';
    emailInput.value = '';
  }

  handleKeyPress(event) {
    const { key } = event;
    const person = this.people.find(person => person.editing);
    console.log(key);

    if (!person) return;

    if (key === 'Enter') {
      const name = document.querySelector('#editName').value;
      const surname = document.querySelector('#editSurname').value;
      const email = document.querySelector('#editEmail').value;

      if (!this.validateEmail(email)) {
        alert('You entered not correct email, please try again!');
        return;
      }

      person.name = name;
      person.surname = surname;
      person.email = email;
      person.editing = false;

      this.render();
    } else if (key === 'Escape') {
      this.people.forEach(person => person.editing = false);
      this.render();
    }
  }

  deleteAllSelectedPeople(event) {
    const newPeopleArr = [];

    this.people.forEach(person => {
      if (!person.selected) newPeopleArr.push(person);
    });

    this.people = newPeopleArr;
    this.render();
  }

  validateEmail(email) {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi;

    return regex.test(email.toString());
  }

  start() {
    const newPersonForm = document.querySelector('.newPerson');
    const btnDeleteSelectedPeople = document.querySelector('.btnDelete');

    document.addEventListener('keydown', this.handleKeyPress.bind(this));
    newPersonForm.addEventListener('submit', this.formSubmit.bind(this));
    btnDeleteSelectedPeople.addEventListener('click', this.deleteAllSelectedPeople.bind(this));

    this.render();
  }
}

const table = new peopleTable();
table.start();
table.addNewPerson('James', 'Bond', 'james007@gmail.com');
