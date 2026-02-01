// NOTE: This file provides UI translations for the 5 supported languages.
// Keep the shape consistent across languages to avoid runtime undefined errors.

export const translations = {
  ka: {
    // Georgian
    header: {
      schedule: 'ორშ - შაბ 8.00 - 18.00',
      address: 'თამაზ გამყრელიძის 19',
      phone: '+995 500 88 30 88',
      companyName: 'LEGENDACAR',
      tagline: 'Car Rental in Georgia',
      home: 'მთავარი',
      vehicles: 'მანქანები',
      services: 'სერვისები',
      contact: 'კონტაქტი',
      booking: 'ჯავშანი',
      admin: 'ადმინი'
    },
    checkout: {
      breadcrumb: 'მთავარი',
      title: 'ჩემი კალათა',
      reservation: 'რეზერვაციის დეტალები',
      reservationDesc: 'აირჩიეთ გამგზავრებისა და დაბრუნების თარიღები',
      pickupLocation: 'აიღეთ ადგილი',
      dropoffLocation: 'ჩაბარების ადგილი',
      selectLocation: 'აირჩიეთ ლოკაცია',
      pickupDate: 'აიღეთ თარიღი',
      dropoffDate: 'ჩაბარების თარიღი',
      time: 'დრო',
      addons: 'დამატებითი სერვისები',
      addonsDesc: 'აირჩიეთ დამატებითი სერვისები თქვენი მოგზაურობისთვის',
      perDay: '/დღე',
      yourInfo: 'თქვენი ინფორმაცია',
      firstName: 'სახელი',
      lastName: 'გვარი',
      email: 'ელფოსტა',
      phone: 'ტელეფონი',
      paymentMethod: 'გადახდის მეთოდი',
      creditCard: 'საბანკო ბარათი',
      creditCardDesc: 'ონლაინ გადახდა ბარათით',
      cash: 'ნაღდი ანგარიში',
      cashDesc: 'გადახდა ოფისში',
      bankTransfer: 'საბანკო გადარიცხვა',
      bankTransferDesc: 'გადახდა საბანკო ანგარიშზე',
      summary: 'შეკვეთის შეჯამება',
      emptyCart: 'თქვენი კალათა ცარიელია!',
      selectVehicle: 'აირჩიეთ მანქანა',
      total: 'სულ',
      bookNow: 'დაჯავშნა',
      newInStore: 'ახალი მაღაზიაში',
      days: 'დღე',
      successTitle: 'წარმატება!',
      successMessage: 'თქვენი ჯავშანი წარმატებით შეიქმნა. ჩვენი ოპერატორი მალე დაგიკავშირდებათ.',
      errorTitle: 'შეცდომა',
      errorMessage: 'გთხოვთ შეავსოთ ყველა სავალდებულო ველი'
    },
    footer: {
      language: 'ენა:',
      followUs: 'გამოგვყევით:',
      copyright: '© 2024 LEGENDACAR - ავტომობილების გაქირავება საქართველოში. ყველა უფლება დაცულია.'
    },
    auth: {
      signInTitle: 'შესვლა',
      signIn: 'შესვლა',
      signUp: 'რეგისტრაცია',
      identifier: 'ელფოსტა / ტელეფონი / მომხმარებელი',
      password: 'პაროლი',
      confirmPassword: 'გაიმეორეთ პაროლი',
      firstName: 'სახელი',
      lastName: 'გვარი',
      phone: 'ტელეფონი',
      emailOptional: 'ელფოსტა (არასავალდებულო)',
      passwordsMatch: 'პაროლები ემთხვევა',
      passwordMismatch: 'პაროლები არ ემთხვევა',
      invalidCredentials: 'არასწორი მონაცემები',
      registerFailed: 'რეგისტრაცია ვერ მოხერხდა',
      errorTitle: 'შეცდომა'
    },
    languages: {
      ka: 'ქართული',
      en: 'English',
      ru: 'Русский',
      tr: 'Türkçe',
      az: 'Azərbaycanca'
    },
    common: {
      success: 'წარმატება',
      error: 'შეცდომა',
      loading: 'იტვირთება...',
      back: 'უკან',
      days: 'დღე',
      logout: 'გამოსვლა',
      edit: 'რედაქტირება',
      delete: 'წაშლა',
      operationFailed: 'ოპერაცია ვერ შესრულდა'
    },
    status: {
      pending: 'დადასტურებას ელოდება',
      active: 'აქტიური',
      rejected: 'უარყოფილია',
      archived: 'არქივი'
    },
    admin: {
      pendingListings: 'მოლოდინში მყოფი განცხადებები',
      noPending: 'მოლოდინში განცხადება არ არის.',
      approve: 'დამტკიცება',
      reject: 'უარყოფა',
      durationDays: 'ვადა',
      pendingLoadError: 'მოლოდინში განცხადებების ჩატვირთვა ვერ მოხერხდა.',
      pendingApproved: 'განცხადება დამტკიცდა და გამოქვეყნდა.',
      pendingRejected: 'განცხადება უარყოფილია.'
    },
    user: {
      panelTitle: 'მომხმარებლის პანელი',
      myListings: 'ჩემი განცხადებები',
      addListing: 'განცხადების დამატება',
      newListing: 'ახალი განცხადება',
      editListing: 'განცხადების რედაქტირება',
      listingSubmitted: 'განცხადება გაგზავნილია დასამტკიცებლად.',
      listingUpdatedPending: 'განცხადება განახლდა და ხელახლა გაგზავნილია დასამტკიცებლად.',
      listingDeleted: 'განცხადება წაიშალა.',
      listingDeleteFailed: 'წაშლა ვერ მოხერხდა.'
    },
    adminUsers: {
      title: 'მომხმარებლები',
      phone: 'ტელეფონი',
      email: 'ელფოსტა',
      registered: 'რეგისტრაცია',
      listings: 'განცხადება'
    },
    adminUserDetail: {
      userInfo: 'მომხმარებლის ინფორმაცია',
      userListings: 'მომხმარებლის განცხადებები',
      save: 'შენახვა',
      resetPassword: 'პაროლის განახლება (შემთხვევითი)',
      newPassword: 'ახალი პაროლი',
      expiry: 'ვადა',
      status: 'სტატუსი',
      noListings: 'განცხადება არ არის.',
      loadFailed: 'მომხმარებლის დეტალების მიღება ვერ მოხერხდა.',
      updated: 'მომხმარებლის ინფორმაცია განახლდა.',
      passwordResetFailed: 'პაროლის შეცვლა ვერ მოხერხდა.',
      archived: 'დაარქივდა',
      deleted: 'წაიშალა',
      archiveConfirm: 'განცხადება დაარქივდეს?',
      deleteConfirm: 'განცხადება წაიშალოს?',
      expiryUpdated: 'ვადა განახლდა',
      statusUpdated: 'სტატუსი განახლდა'
    }
  },

  en: {
    // English
    header: {
      schedule: 'Mon - Sat 8.00 - 18.00',
      address: 'Tamaz Gamkrelidze 19',
      phone: '+995 500 88 30 88',
      companyName: 'LEGENDACAR',
      tagline: 'Car Rental in Georgia',
      home: 'Home',
      vehicles: 'Vehicles',
      services: 'Services',
      contact: 'Contact',
      booking: 'Booking',
      admin: 'Admin'
    },
    checkout: {
      breadcrumb: 'Home',
      title: 'My Cart',
      reservation: 'Reservation Details',
      reservationDesc: 'Choose your pickup and drop-off dates',
      pickupLocation: 'Pick-up Location',
      dropoffLocation: 'Drop-off Location',
      selectLocation: 'Select Location',
      pickupDate: 'Pick-up Date',
      dropoffDate: 'Drop-off Date',
      time: 'Time',
      addons: 'Additional Services',
      addonsDesc: 'Choose additional services for your trip',
      perDay: '/day',
      yourInfo: 'Your Information',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      paymentMethod: 'Payment Method',
      creditCard: 'Credit Card',
      creditCardDesc: 'Online payment by card',
      cash: 'Cash Payment',
      cashDesc: 'Payment at office',
      bankTransfer: 'Bank Transfer',
      bankTransferDesc: 'Payment to bank account',
      summary: 'Order Summary',
      emptyCart: 'Your cart is empty!',
      selectVehicle: 'Select Vehicle',
      total: 'Total',
      bookNow: 'Book Now',
      newInStore: 'New in Store',
      days: 'days',
      successTitle: 'Success!',
      successMessage: 'Your booking has been created successfully. Our operator will contact you soon.',
      errorTitle: 'Error',
      errorMessage: 'Please fill in all required fields'
    },
    footer: {
      language: 'Language:',
      followUs: 'Follow Us:',
      copyright: '© 2024 LEGENDACAR - Car Rental in Georgia. All rights reserved.'
    },
    auth: {
      signInTitle: 'Sign In',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      identifier: 'Email / phone / username',
      password: 'Password',
      confirmPassword: 'Confirm password',
      firstName: 'First name',
      lastName: 'Last name',
      phone: 'Phone',
      emailOptional: 'Email (optional)',
      passwordsMatch: 'Passwords match',
      passwordMismatch: 'Passwords do not match',
      invalidCredentials: 'Invalid credentials',
      registerFailed: 'Registration failed',
      errorTitle: 'Error'
    },
    languages: {
      ka: 'Georgian',
      en: 'English',
      ru: 'Russian',
      tr: 'Turkish',
      az: 'Azerbaijani'
    },
    common: {
      success: 'Success',
      error: 'Error',
      loading: 'Loading...',
      back: 'Back',
      days: 'days',
      logout: 'Logout',
      edit: 'Edit',
      delete: 'Delete',
      operationFailed: 'Operation failed'
    },
    status: {
      pending: 'Pending approval',
      active: 'Live',
      rejected: 'Rejected',
      archived: 'Archived'
    },
    admin: {
      pendingListings: 'Pending listings',
      noPending: 'No pending listings.',
      approve: 'Approve',
      reject: 'Reject',
      durationDays: 'Duration',
      pendingLoadError: 'Could not load pending listings.',
      pendingApproved: 'Listing approved and published.',
      pendingRejected: 'Listing rejected.'
    },
    user: {
      panelTitle: 'User Panel',
      myListings: 'My listings',
      addListing: 'Add listing',
      newListing: 'New listing',
      editListing: 'Edit listing',
      listingSubmitted: 'Listing submitted for approval.',
      listingUpdatedPending: 'Listing updated and resubmitted for approval.',
      listingDeleted: 'Listing deleted.',
      listingDeleteFailed: 'Could not delete listing.'
    },
    adminUsers: {
      title: 'Users',
      phone: 'Phone',
      email: 'Email',
      registered: 'Registered',
      listings: 'listings'
    },
    adminUserDetail: {
      userInfo: 'User information',
      userListings: "User's listings",
      save: 'Save',
      resetPassword: 'Reset password (random)',
      newPassword: 'New password',
      expiry: 'Expiry',
      status: 'Status',
      noListings: 'No listings.',
      loadFailed: 'Could not load user details.',
      updated: 'User updated.',
      passwordResetFailed: 'Could not reset password.',
      archived: 'Archived',
      deleted: 'Deleted',
      archiveConfirm: 'Archive this listing?',
      deleteConfirm: 'Delete this listing?',
      expiryUpdated: 'Expiry updated',
      statusUpdated: 'Status updated'
    }
  },

  ru: {
    // Russian
    header: {
      schedule: 'Пн - Сб 8.00 - 18.00',
      address: 'Тамаз Гамкрелидзе 19',
      phone: '+995 500 88 30 88',
      companyName: 'LEGENDACAR',
      tagline: 'Аренда авто в Грузии',
      home: 'Главная',
      vehicles: 'Автомобили',
      services: 'Услуги',
      contact: 'Контакты',
      booking: 'Бронирование',
      admin: 'Админ'
    },
    checkout: {
      breadcrumb: 'Главная',
      title: 'Моя корзина',
      reservation: 'Детали бронирования',
      reservationDesc: 'Выберите даты получения и возврата',
      pickupLocation: 'Место получения',
      dropoffLocation: 'Место возврата',
      selectLocation: 'Выберите локацию',
      pickupDate: 'Дата получения',
      dropoffDate: 'Дата возврата',
      time: 'Время',
      addons: 'Дополнительные услуги',
      addonsDesc: 'Выберите дополнительные услуги для вашей поездки',
      perDay: '/день',
      yourInfo: 'Ваша информация',
      firstName: 'Имя',
      lastName: 'Фамилия',
      email: 'Эл. почта',
      phone: 'Телефон',
      paymentMethod: 'Способ оплаты',
      creditCard: 'Банковская карта',
      creditCardDesc: 'Онлайн оплата картой',
      cash: 'Наличные',
      cashDesc: 'Оплата в офисе',
      bankTransfer: 'Банковский перевод',
      bankTransferDesc: 'Оплата на банковский счет',
      summary: 'Итого заказа',
      emptyCart: 'Ваша корзина пуста!',
      selectVehicle: 'Выбрать автомобиль',
      total: 'Всего',
      bookNow: 'Забронировать',
      newInStore: 'Новинки',
      days: 'дней',
      successTitle: 'Успешно!',
      successMessage: 'Ваше бронирование создано успешно. Наш оператор свяжется с вами в ближайшее время.',
      errorTitle: 'Ошибка',
      errorMessage: 'Пожалуйста, заполните все обязательные поля'
    },
    footer: {
      language: 'Язык:',
      followUs: 'Подписывайтесь:',
      copyright: '© 2024 LEGENDACAR - Аренда авто в Грузии. Все права защищены.'
    },
    auth: {
      signInTitle: 'Вход',
      signIn: 'Войти',
      signUp: 'Регистрация',
      identifier: 'Email / телефон / логин',
      password: 'Пароль',
      confirmPassword: 'Повторите пароль',
      firstName: 'Имя',
      lastName: 'Фамилия',
      phone: 'Телефон',
      emailOptional: 'Email (необязательно)',
      passwordsMatch: 'Пароли совпадают',
      passwordMismatch: 'Пароли не совпадают',
      invalidCredentials: 'Неверные данные',
      registerFailed: 'Регистрация не удалась',
      errorTitle: 'Ошибка'
    },
    languages: {
      ka: 'Грузинский',
      en: 'Английский',
      ru: 'Русский',
      tr: 'Турецкий',
      az: 'Азербайджанский'
    },
    common: {
      success: 'Успешно',
      error: 'Ошибка',
      loading: 'Загрузка...',
      back: 'Назад',
      days: 'дн.',
      logout: 'Выйти',
      edit: 'Редактировать',
      delete: 'Удалить',
      operationFailed: 'Операция не выполнена'
    },
    status: {
      pending: 'Ожидает проверки',
      active: 'Опубликовано',
      rejected: 'Отклонено',
      archived: 'Архив'
    },
    admin: {
      pendingListings: 'Ожидающие объявления',
      noPending: 'Нет ожидающих объявлений.',
      approve: 'Одобрить',
      reject: 'Отклонить',
      durationDays: 'Срок',
      pendingLoadError: 'Не удалось загрузить ожидающие объявления.',
      pendingApproved: 'Объявление одобрено и опубликовано.',
      pendingRejected: 'Объявление отклонено.'
    },
    user: {
      panelTitle: 'Панель пользователя',
      myListings: 'Мои объявления',
      addListing: 'Добавить объявление',
      newListing: 'Новое объявление',
      editListing: 'Редактировать',
      listingSubmitted: 'Объявление отправлено на проверку.',
      listingUpdatedPending: 'Объявление обновлено и отправлено на проверку.',
      listingDeleted: 'Объявление удалено.',
      listingDeleteFailed: 'Не удалось удалить.'
    },
    adminUsers: {
      title: 'Пользователи',
      phone: 'Телефон',
      email: 'Email',
      registered: 'Регистрация',
      listings: 'объявл.'
    },
    adminUserDetail: {
      userInfo: 'Информация о пользователе',
      userListings: 'Объявления пользователя',
      save: 'Сохранить',
      resetPassword: 'Сбросить пароль (случайный)',
      newPassword: 'Новый пароль',
      expiry: 'Срок',
      status: 'Статус',
      noListings: 'Нет объявлений.',
      loadFailed: 'Не удалось загрузить данные пользователя.',
      updated: 'Данные пользователя обновлены.',
      passwordResetFailed: 'Не удалось сбросить пароль.',
      archived: 'В архиве',
      deleted: 'Удалено',
      archiveConfirm: 'Архивировать объявление?',
      deleteConfirm: 'Удалить объявление?',
      expiryUpdated: 'Срок обновлен',
      statusUpdated: 'Статус обновлен'
    }
  },

  tr: {
    // Turkish
    header: {
      schedule: 'Pzt - Cmt 8.00 - 18.00',
      address: 'Tamaz Gamkrelidze 19',
      phone: '+995 500 88 30 88',
      companyName: 'LEGENDACAR',
      tagline: "Gürcistan'da Araç Kiralama",
      home: 'Ana Sayfa',
      vehicles: 'Araçlar',
      services: 'Hizmetler',
      contact: 'İletişim',
      booking: 'Rezervasyon',
      admin: 'Admin'
    },
    checkout: {
      breadcrumb: 'Ana Sayfa',
      title: 'Sepetim',
      reservation: 'Rezervasyon Detayları',
      reservationDesc: 'Alış ve teslim tarihlerinizi seçin',
      pickupLocation: 'Alış Yeri',
      dropoffLocation: 'Teslim Yeri',
      selectLocation: 'Lokasyon Seçin',
      pickupDate: 'Alış Tarihi',
      dropoffDate: 'Teslim Tarihi',
      time: 'Saat',
      addons: 'Ek Hizmetler',
      addonsDesc: 'Yolculuğunuz için ek hizmetler seçin',
      perDay: '/gün',
      yourInfo: 'Bilgileriniz',
      firstName: 'Ad',
      lastName: 'Soyad',
      email: 'E-posta',
      phone: 'Telefon',
      paymentMethod: 'Ödeme Yöntemi',
      creditCard: 'Kredi Kartı',
      creditCardDesc: 'Kartla online ödeme',
      cash: 'Nakit Ödeme',
      cashDesc: 'Ofiste ödeme',
      bankTransfer: 'Banka Havalesi',
      bankTransferDesc: 'Banka hesabına ödeme',
      summary: 'Sipariş Özeti',
      emptyCart: 'Sepetiniz boş!',
      selectVehicle: 'Araç Seç',
      total: 'Toplam',
      bookNow: 'Rezervasyon Yap',
      newInStore: 'Yeni Ürünler',
      days: 'gün',
      successTitle: 'Başarılı!',
      successMessage: 'Rezervasyonunuz başarıyla oluşturuldu. Operatörümüz en kısa sürede sizinle iletişime geçecektir.',
      errorTitle: 'Hata',
      errorMessage: 'Lütfen tüm gerekli alanları doldurun'
    },
    footer: {
      language: 'Dil:',
      followUs: 'Takip Edin:',
      copyright: "© 2024 LEGENDACAR - Gürcistan'da Araç Kiralama. Tüm hakları saklıdır."
    },
    auth: {
      signInTitle: 'Giriş Yap',
      signIn: 'Giriş Yap',
      signUp: 'Kayıt Ol',
      identifier: 'E-posta / telefon / kullanıcı adı',
      password: 'Şifre',
      confirmPassword: 'Şifre tekrar',
      firstName: 'Ad',
      lastName: 'Soyad',
      phone: 'Telefon',
      emailOptional: 'E-posta (opsiyonel)',
      passwordsMatch: 'Şifreler eşleşiyor',
      passwordMismatch: 'Şifreler eşleşmiyor',
      invalidCredentials: 'Hatalı bilgiler',
      registerFailed: 'Kayıt başarısız',
      errorTitle: 'Hata'
    },
    languages: {
      ka: 'Gürcüce',
      en: 'İngilizce',
      ru: 'Rusça',
      tr: 'Türkçe',
      az: 'Azerice'
    },
    common: {
      success: 'Başarılı',
      error: 'Hata',
      loading: 'Yükleniyor...',
      back: 'Geri',
      days: 'gün',
      logout: 'Çıkış',
      edit: 'Düzenle',
      delete: 'Sil',
      operationFailed: 'İşlem başarısız'
    },
    status: {
      pending: 'Onay bekliyor',
      active: 'Yayında',
      rejected: 'Reddedildi',
      archived: 'Arşiv'
    },
    admin: {
      pendingListings: 'Bekleyen İlanlar',
      noPending: 'Bekleyen ilan yok.',
      approve: 'Onayla',
      reject: 'Reddet',
      durationDays: 'Süre',
      pendingLoadError: 'Bekleyen ilanlar alınamadı.',
      pendingApproved: 'İlan onaylandı ve yayına alındı.',
      pendingRejected: 'İlan reddedildi.'
    },
    user: {
      panelTitle: 'Kullanıcı Paneli',
      myListings: 'İlanlarım',
      addListing: 'İlan Ekle',
      newListing: 'Yeni İlan Ekle',
      editListing: 'İlan Düzenle',
      listingSubmitted: 'İlan onaya gönderildi.',
      listingUpdatedPending: 'İlan güncellendi ve yeniden onaya gönderildi.',
      listingDeleted: 'İlan silindi.',
      listingDeleteFailed: 'Silinemedi.'
    },
    adminUsers: {
      title: 'Kullanıcılar',
      phone: 'Telefon',
      email: 'E-posta',
      registered: 'Kayıt',
      listings: 'ilan'
    },
    adminUserDetail: {
      userInfo: 'Kullanıcı Bilgileri',
      userListings: 'Kullanıcının İlanları',
      save: 'Kaydet',
      resetPassword: 'Şifre Sıfırla (Rastgele)',
      newPassword: 'Yeni şifre',
      expiry: 'Süre',
      status: 'Durum',
      noListings: 'İlan yok.',
      loadFailed: 'Kullanıcı detayı alınamadı.',
      updated: 'Kullanıcı bilgileri güncellendi.',
      passwordResetFailed: 'Şifre değiştirilemedi.',
      archived: 'Arşivlendi',
      deleted: 'Silindi',
      archiveConfirm: 'İlan arşive alınsın mı?',
      deleteConfirm: 'İlan silinsin mi?',
      expiryUpdated: 'Süre güncellendi',
      statusUpdated: 'Durum güncellendi'
    }
  },

  az: {
    // Azerbaijani
    header: {
      schedule: 'Baz.e - Şə 8.00 - 18.00',
      address: 'Tamaz Qamkrelidze 19',
      phone: '+995 500 88 30 88',
      companyName: 'LEGENDACAR',
      tagline: 'Gürcüstanda Avtomobil İcarəsi',
      home: 'Ana Səhifə',
      vehicles: 'Avtomobillər',
      services: 'Xidmətlər',
      contact: 'Əlaqə',
      booking: 'Rezervasiya',
      admin: 'Admin'
    },
    checkout: {
      breadcrumb: 'Ana Səhifə',
      title: 'Səbətim',
      reservation: 'Rezervasiya Təfərrüatları',
      reservationDesc: 'Götürmə və təhvil vermə tarixlərini seçin',
      pickupLocation: 'Götürmə Yeri',
      dropoffLocation: 'Təhvil Yeri',
      selectLocation: 'Yer Seçin',
      pickupDate: 'Götürmə Tarixi',
      dropoffDate: 'Təhvil Tarixi',
      time: 'Vaxt',
      addons: 'Əlavə Xidmətlər',
      addonsDesc: 'Səfəriniz üçün əlavə xidmətlər seçin',
      perDay: '/gün',
      yourInfo: 'Məlumatlarınız',
      firstName: 'Ad',
      lastName: 'Soyad',
      email: 'E-poçt',
      phone: 'Telefon',
      paymentMethod: 'Ödəniş Üsulu',
      creditCard: 'Kredit Kartı',
      creditCardDesc: 'Kartla onlayn ödəniş',
      cash: 'Nəğd Ödəniş',
      cashDesc: 'Ofisdə ödəniş',
      bankTransfer: 'Bank Köçürməsi',
      bankTransferDesc: 'Bank hesabına ödəniş',
      summary: 'Sifariş Xülasəsi',
      emptyCart: 'Səbətiniz boşdur!',
      selectVehicle: 'Avtomobil Seçin',
      total: 'Cəmi',
      bookNow: 'İndi Sifariş Verin',
      newInStore: 'Yeni Məhsullar',
      days: 'gün',
      successTitle: 'Uğurlu!',
      successMessage: 'Rezervasiyanız uğurla yaradıldı. Operatorumuz tezliklə sizinlə əlaqə saxlayacaq.',
      errorTitle: 'Səhv',
      errorMessage: 'Zəhmət olmasa bütün tələb olunan sahələri doldurun'
    },
    footer: {
      language: 'Dil:',
      followUs: 'Bizi İzləyin:',
      copyright: '© 2024 LEGENDACAR - Gürcüstanda Avtomobil İcarəsi. Bütün hüquqlar qorunur.'
    },
    auth: {
      signInTitle: 'Giriş',
      signIn: 'Daxil ol',
      signUp: 'Qeydiyyat',
      identifier: 'E-poçt / telefon / istifadəçi adı',
      password: 'Şifrə',
      confirmPassword: 'Şifrə təkrar',
      firstName: 'Ad',
      lastName: 'Soyad',
      phone: 'Telefon',
      emailOptional: 'E-poçt (opsional)',
      passwordsMatch: 'Şifrələr eynidir',
      passwordMismatch: 'Şifrələr eyni deyil',
      invalidCredentials: 'Yanlış məlumatlar',
      registerFailed: 'Qeydiyyat alınmadı',
      errorTitle: 'Xəta'
    },
    languages: {
      ka: 'Gürcü',
      en: 'İngilis',
      ru: 'Rus',
      tr: 'Türk',
      az: 'Azərbaycan'
    },
    common: {
      success: 'Uğurlu',
      error: 'Xəta',
      loading: 'Yüklənir...',
      back: 'Geri',
      days: 'gün',
      logout: 'Çıxış',
      edit: 'Düzəliş et',
      delete: 'Sil',
      operationFailed: 'Əməliyyat alınmadı'
    },
    status: {
      pending: 'Təsdiq gözləyir',
      active: 'Yayında',
      rejected: 'Rədd edildi',
      archived: 'Arxiv'
    },
    admin: {
      pendingListings: 'Gözləyən Elanlar',
      noPending: 'Gözləyən elan yoxdur.',
      approve: 'Təsdiqlə',
      reject: 'Rədd et',
      durationDays: 'Müddət',
      pendingLoadError: 'Gözləyən elanlar yüklənmədi.',
      pendingApproved: 'Elan təsdiqləndi və yayımlandı.',
      pendingRejected: 'Elan rədd edildi.'
    },
    user: {
      panelTitle: 'İstifadəçi Paneli',
      myListings: 'Elanlarım',
      addListing: 'Elan əlavə et',
      newListing: 'Yeni elan',
      editListing: 'Elanı düzəlt',
      listingSubmitted: 'Elan təsdiq üçün göndərildi.',
      listingUpdatedPending: 'Elan yeniləndi və yenidən təsdiq üçün göndərildi.',
      listingDeleted: 'Elan silindi.',
      listingDeleteFailed: 'Silinmədi.'
    },
    adminUsers: {
      title: 'İstifadəçilər',
      phone: 'Telefon',
      email: 'E-poçt',
      registered: 'Qeydiyyat',
      listings: 'elan'
    },
    adminUserDetail: {
      userInfo: 'İstifadəçi məlumatları',
      userListings: 'İstifadəçinin elanları',
      save: 'Yadda saxla',
      resetPassword: 'Şifrəni sıfırla (təsadüfi)',
      newPassword: 'Yeni şifrə',
      expiry: 'Müddət',
      status: 'Status',
      noListings: 'Elan yoxdur.',
      loadFailed: 'İstifadəçi məlumatları yüklənmədi.',
      updated: 'İstifadəçi məlumatları yeniləndi.',
      passwordResetFailed: 'Şifrə sıfırlanmadı.',
      archived: 'Arxivləndi',
      deleted: 'Silindi',
      archiveConfirm: 'Elan arxivlənsin?',
      deleteConfirm: 'Elan silinsin?',
      expiryUpdated: 'Müddət yeniləndi',
      statusUpdated: 'Status yeniləndi'
    }
  }
};

// Addons & locations are used by the legacy checkout page.
export const addonTranslations = {
  ka: {
    1: { name: 'დაზღვევა (Insurance)', description: 'სრული დაცვის დაზღვევა' },
    2: { name: 'ზარალის დაზღვევა', description: 'ზარალის შემთხვევაში დაცვა' },
    3: { name: 'შეზღუდული შესაძლებლობების კონტროლი', description: 'სპეციალური მართვის სისტემა' },
    4: { name: 'GPS ნავიგაცია', description: 'თანამედროვე GPS სისტემა' },
    5: { name: 'ბავშვის სკამი', description: 'უსაფრთხო ბავშვის სკამი' },
    6: { name: 'დამატებითი მძღოლი', description: 'მეორე მძღოლის დამატება' }
  },
  en: {
    1: { name: 'Super Protective Insurance', description: 'Full coverage insurance' },
    2: { name: 'Loss Damage Waiver', description: 'Protection in case of damage' },
    3: { name: 'Handicap Controls', description: 'Special control system' },
    4: { name: 'GPS Navigation', description: 'Modern GPS system' },
    5: { name: 'Child Seat', description: 'Safe child seat' },
    6: { name: 'Additional Driver', description: 'Add second driver' }
  },
  ru: {
    1: { name: 'Супер Защитная Страховка', description: 'Полное страховое покрытие' },
    2: { name: 'Отказ от возмещения ущерба', description: 'Защита в случае повреждения' },
    3: { name: 'Управление для инвалидов', description: 'Специальная система управления' },
    4: { name: 'GPS Навигация', description: 'Современная GPS система' },
    5: { name: 'Детское кресло', description: 'Безопасное детское кресло' },
    6: { name: 'Дополнительный водитель', description: 'Добавить второго водителя' }
  },
  tr: {
    1: { name: 'Süper Koruyucu Sigorta', description: 'Tam kapsamlı sigorta' },
    2: { name: 'Hasar Muafiyeti', description: 'Hasar durumunda koruma' },
    3: { name: 'Engelli Kontrolleri', description: 'Özel kontrol sistemi' },
    4: { name: 'GPS Navigasyon', description: 'Modern GPS sistemi' },
    5: { name: 'Çocuk Koltuğu', description: 'Güvenli çocuk koltuğu' },
    6: { name: 'Ek Sürücü', description: 'İkinci sürücü ekle' }
  },
  az: {
    1: { name: 'Super Qoruyucu Sığorta', description: 'Tam təminat sığortası' },
    2: { name: 'Zərər Ödənişindən İmtina', description: 'Zərər halında müdafiə' },
    3: { name: 'Əlil Nəzarəti', description: 'Xüsusi idarəetmə sistemi' },
    4: { name: 'GPS Naviqasiya', description: 'Müasir GPS sistemi' },
    5: { name: 'Uşaq Oturacağı', description: 'Təhlükəsiz uşaq oturacağı' },
    6: { name: 'Əlavə Sürücü', description: 'İkinci sürücünü əlavə edin' }
  }
};

export const locationTranslations = {
  ka: {
    1: { name: 'თბილისის აეროპორტი (Tbilisi Airport)', city: 'თბილისი' },
    2: { name: 'თამაზ გამყრელიძის 19 (Office)', city: 'თბილისი' },
    3: { name: 'ბათუმის აეროპორტი (Batumi Airport)', city: 'ბათუმი' },
    4: { name: 'ქუთაისის აეროპორტი (Kutaisi Airport)', city: 'ქუთაისი' }
  },
  en: {
    1: { name: 'Tbilisi Airport', city: 'Tbilisi' },
    2: { name: 'Tamaz Gamkrelidze 19 (Office)', city: 'Tbilisi' },
    3: { name: 'Batumi Airport', city: 'Batumi' },
    4: { name: 'Kutaisi Airport', city: 'Kutaisi' }
  },
  ru: {
    1: { name: 'Аэропорт Тбилиси', city: 'Тбилиси' },
    2: { name: 'Тамаз Гамкрелидзе 19 (Офис)', city: 'Тбилиси' },
    3: { name: 'Аэропорт Батуми', city: 'Батуми' },
    4: { name: 'Аэропорт Кутаиси', city: 'Кутаиси' }
  },
  tr: {
    1: { name: 'Tiflis Havalimanı', city: 'Tiflis' },
    2: { name: 'Tamaz Gamkrelidze 19 (Ofis)', city: 'Tiflis' },
    3: { name: 'Batum Havalimanı', city: 'Batum' },
    4: { name: 'Kutaisi Havalimanı', city: 'Kutaisi' }
  },
  az: {
    1: { name: 'Tiblisi Hava Limanı', city: 'Tiblisi' },
    2: { name: 'Tamaz Qamkrelidze 19 (Ofis)', city: 'Tiblisi' },
    3: { name: 'Batumi Hava Limanı', city: 'Batumi' },
    4: { name: 'Kutaisi Hava Limanı', city: 'Kutaisi' }
  }
};
