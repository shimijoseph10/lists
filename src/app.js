let elements = {
  navigator: null,
  template: null,
  alertBtn: null,
  confirmBtn: null,
  promptBtn: null,
  toastBtn: null,
  sheetBtn: null,
  chevronRow: null,
  chevronRow2: null,
  cardBtn: null,
};

const showAlert = () => {
  ons.notification.alert('Alert!');
};

const showConfirm = async () => {
  try {
    const result = await ons.notification.confirm('Confirm!');
    ons.notification.alert(`You selected: ${result ? 'Ok' : 'Cancel'}`);
  } catch (e) {
    console.error(e);
  }
};

const showPrompt = async () => {
  try {
    const result = await ons.notification.prompt('Prompt!');
    const message = result ? 'Entered: ' + result : 'Entered nothing!';
    ons.notification.alert(message);
  } catch (e) {
    console.error(e);
  }
};

const showToast = () => {
  ons.notification.toast('Toast!', {
    timeout: 2000,
  });
};

const showActionSheet = async () => {
  try {
    const btns = [
      'Label 0',
      'Label 1',
      {
        label: 'Label 2',
        modifier: 'destructive',
      },
      {
        label: 'Cancel',
        icon: 'md-close',
      },
    ];
    const index = await ons.openActionSheet({
      title: 'My Action Sheet',
      cancelable: true,
      buttons: btns,
    });
    const result = btns[index];
    ons.notification.alert(`You selected ${result?.label || result || 'nothing'}`);
  } catch (e) {
    console.error(e);
  }
};

const popPage = () => elements.navigator.popPage();

const changePage = (page, data) => {
  elements.navigator.pushPage(page, { data });
};

const changeStyle = (e) => {
  const plat = e.target.checked ? 'android' : 'ios';
  ons.forcePlatformStyling(plat);
};

const setUpPage = (evt) => {
  console.log('start init', evt.target.id);
  if (evt.target.id === 'home') {
    elements = {
      navigator: document.querySelector('#navigator'),
      template: document.querySelector('template').content,
      alertBtn: document.querySelector('#alertBtn'),
      confirmBtn: document.querySelector('#confirmBtn'),
      promptBtn: document.querySelector('#promptBtn'),
      toastBtn: document.querySelector('#toastBtn'),
      chevronRow: document.querySelector('#chevron-row'),
      chevronRow2: document.querySelector('#chevron-row2'),
      chevronRow3: document.querySelector('#chevron-row3'),
      switch: document.querySelector('#switch'),
      sheetBtn: document.querySelector('#sheetBtn'),
    };
    elements.chevronRow.addEventListener('click', () => changePage('views/tabs.html'));
    elements.chevronRow2.addEventListener('click', () => changePage('views/cards.html', { someKey: 'someValue' }));
    elements.chevronRow3.addEventListener('click', () => changePage('empty.html'));
    elements.alertBtn.addEventListener('click', showAlert);
    elements.confirmBtn.addEventListener('click', showConfirm);
    elements.promptBtn.addEventListener('click', showPrompt);
    elements.toastBtn.addEventListener('click', showToast);
    elements.sheetBtn.addEventListener('click', showActionSheet);
    elements.switch.addEventListener('change', changeStyle);
  }

  if (evt.target.id === 'cards') {
    elements.cardBtn = document.querySelector('#cardBtn');
    elements.cardBtn.addEventListener('click', () => changePage('views/tabs.html'));
    console.log(elements.navigator.topPage.data);
  }
};

document.addEventListener('init', setUpPage);

// Padd the history with an extra page so that we don't exit right away
window.addEventListener('load', () => window.history.pushState({ }, ''));
// When the browser goes back a page, if our navigator has more than one page we pop the page and prevent the back event by adding a new page
// Otherwise we trigger a second back event, because we padded the history we need to go back twice to exit the app.
window.addEventListener('popstate', () => {
  const { pages } = elements.navigator;
  if (pages && pages.length > 1) {
    popPage();
    window.history.pushState({ }, '');
  } else {
    window.history.back();
  }
});
