"use strict";

(() => {
  const messages = {
    en: {
      siteLanguage: "Site language",
      share: "Share", help: "How to use", hero: "Live Korean captions",
      tagline: "Speak in your language. Your friend can read along in Korean.",
      captionSize: "Caption size", smaller: "Decrease caption size", larger: "Increase caption size",
      expand: "Expand caption view", collapse: "Exit expanded caption view", captions: "Korean captions",
      clear: "Clear", clearCaptions: "Clear captions", microphone: "Microphone", spokenLanguage: "Spoken language",
      start: "Start microphone", cancel: "Cancel microphone", stop: "Stop microphone", stopping: "Stopping…",
      micIdle: "Allow microphone access when prompted.", micStarting: "Allow microphone access if your browser asks.",
      micLive: "Listening. Speak in short phrases.", micReconnecting: "Reconnecting the microphone…",
      micStopping: "Finishing the last phrase…", micUnavailable: "Live speech is unavailable here. Open in Chrome or type a message.",
      errPermission: "Microphone permission is blocked. Allow it in your browser’s site settings, or type a message.",
      errService: "Browser speech recognition is unavailable. Try Chrome or type a message.",
      errDevice: "No microphone was found. Connect one or type a message.",
      errNetwork: "The browser’s speech service is unreachable. Check your connection and try again, or type a message.",
      errLanguage: "The browser can’t recognize this language. Try another language or type a message.",
      errStopped: "The microphone stopped unexpectedly. Start it again or type a message.",
      errAndroidSpeech: "Android speech recognition ended. Reopen Malbit in Chrome and check microphone access, or use the keyboard mic under Type a message.",
      errSilence: "No speech detected. Start again and speak closer to the microphone.",
      type: "Type a message", example: "Show an example", cleared: "Captions clear when you reload.",
      github: "Improve on GitHub",
      processing: "How speech and translation are processed", shareTitle: "Share Malbit", shareClose: "Close share",
      close: "Close", qrAlt: "QR code for opening Malbit", scan: "Scan to open Malbit on another device.",
      publicLink: "Public link", copy: "Copy link", copied: "Link copied.", copyFallback: "Link selected. Copy it to share.",
      helpTitle: "Use Malbit together",
      helpScreen: "Open this page in Chrome if possible. Put the screen where your friend can see it.",
      helpStart: "Choose the language you’ll speak, select Start microphone, and allow access.",
      helpSpeak: "Speak in short phrases. Captions may change until the phrase is complete.",
      helpRead: "Expand the caption view for larger text. You can also type a message.",
      providers: "Speech and translation providers",
      providerAudio: "Your browser may send audio to its speech recognition service.",
      providerTranslation: "Chrome uses on-device translation when the language pack is ready. Otherwise, Malbit sends text to MyMemory for translation. MyMemory has a free daily limit.",
      providerStorage: "Malbit stores captions in this open tab.", providerTerms: "MyMemory terms",
      messageIn: "Message in {language}", placeholder: "Write something to translate…",
      typeIdle: "The translation appears on the caption screen.", showKorean: "Show in Korean", translating: "Translating…",
      quota: "The online translation limit has been reached. Try tomorrow or use Chrome’s on-device translation.",
      translateFailed: "Translation failed. Check your connection and try again."
    },
    ko: {
      siteLanguage: "사이트 언어",
      share: "공유", help: "사용 방법", hero: "실시간 한국어 자막",
      tagline: "편한 언어로 말해 보세요. 친구가 한국어 자막으로 읽을 수 있어요.",
      captionSize: "자막 크기", smaller: "자막 글자 줄이기", larger: "자막 글자 키우기",
      expand: "자막 화면 확대", collapse: "자막 화면 확대 종료", captions: "한국어 자막",
      clear: "지우기", clearCaptions: "자막 지우기", microphone: "마이크", spokenLanguage: "말하는 언어",
      start: "마이크 켜기", cancel: "마이크 연결 취소", stop: "마이크 끄기", stopping: "끄는 중…",
      micIdle: "팝업이 뜨면 마이크 사용을 허용해 주세요.", micStarting: "브라우저에서 요청하면 마이크 사용을 허용해 주세요.",
      micLive: "듣고 있어요. 짧은 문장으로 말해 주세요.", micReconnecting: "마이크를 다시 연결하는 중…",
      micStopping: "마지막 문장을 처리하는 중…", micUnavailable: "여기서는 음성 인식을 사용할 수 없어요. Chrome으로 열거나 메시지를 입력해 주세요.",
      errPermission: "마이크가 차단되어 있어요. 브라우저 사이트 설정에서 허용하거나 메시지를 입력해 주세요.",
      errService: "브라우저에서 음성 인식을 사용할 수 없어요. Chrome으로 열거나 메시지를 입력해 주세요.",
      errDevice: "마이크를 찾을 수 없어요. 마이크를 연결하거나 메시지를 입력해 주세요.",
      errNetwork: "음성 인식 서비스에 연결할 수 없어요. 인터넷 연결을 확인하거나 메시지를 입력해 주세요.",
      errLanguage: "브라우저에서 이 언어를 인식할 수 없어요. 다른 언어를 선택하거나 메시지를 입력해 주세요.",
      errStopped: "마이크가 갑자기 꺼졌어요. 다시 켜거나 메시지를 입력해 주세요.",
      errAndroidSpeech: "Android 음성 인식이 종료됐어요. Chrome에서 말빛을 열고 마이크 권한을 확인하거나 메시지 입력에서 키보드의 마이크를 사용해 주세요.",
      errSilence: "음성이 감지되지 않았어요. 마이크를 다시 켜고 가까이에서 말해 주세요.",
      type: "메시지 입력", example: "예시 보기", cleared: "새로고침하면 자막이 지워져요.",
      github: "GitHub에서 기여하기",
      processing: "음성 인식 및 번역 처리 방식", shareTitle: "말빛 공유", shareClose: "공유 창 닫기",
      close: "닫기", qrAlt: "말빛을 여는 QR 코드", scan: "스캔하면 다른 기기에서 말빛이 열려요.",
      publicLink: "공개 링크", copy: "링크 복사", copied: "링크를 복사했어요.", copyFallback: "링크를 선택했어요. 복사해서 공유해 주세요.",
      helpTitle: "말빛 사용 방법",
      helpScreen: "가능하면 Chrome에서 이 페이지를 열고, 친구가 볼 수 있도록 화면을 놓아 주세요.",
      helpStart: "말할 언어를 선택한 뒤 마이크 켜기를 누르고 마이크 사용을 허용해 주세요.",
      helpSpeak: "짧은 문장으로 말해 주세요. 문장이 끝날 때까지 자막이 바뀔 수 있어요.",
      helpRead: "자막을 더 크게 보려면 화면을 확대해 주세요. 메시지를 직접 입력할 수도 있어요.",
      providers: "음성 인식 및 번역 서비스",
      providerAudio: "브라우저가 음성을 음성 인식 서비스로 보낼 수 있어요.",
      providerTranslation: "Chrome에 언어 팩이 준비되어 있으면 기기에서 번역해요. 그 외에는 말빛이 번역할 텍스트를 MyMemory로 보내요. MyMemory의 무료 사용량에는 하루 한도가 있어요.",
      providerStorage: "말빛은 현재 탭에만 자막을 보관해요.", providerTerms: "MyMemory 이용약관",
      messageIn: "메시지 입력 ({language})", placeholder: "번역할 내용을 입력해 주세요…",
      typeIdle: "번역된 내용이 자막 화면에 표시돼요.", showKorean: "한국어로 표시", translating: "번역 중…",
      quota: "온라인 번역의 하루 한도에 도달했어요. 내일 다시 시도하거나 Chrome의 기기 내 번역을 사용해 주세요.",
      translateFailed: "번역하지 못했어요. 인터넷 연결을 확인하고 다시 시도해 주세요."
    },
    it: {
      siteLanguage: "Lingua del sito",
      share: "Condividi", help: "Come si usa", hero: "Sottotitoli in coreano in diretta",
      tagline: "Parla nella tua lingua. Il tuo amico può leggere i sottotitoli in coreano.",
      captionSize: "Dimensione dei sottotitoli", smaller: "Riduci i sottotitoli", larger: "Ingrandisci i sottotitoli",
      expand: "Espandi la vista dei sottotitoli", collapse: "Chiudi la vista espansa", captions: "Sottotitoli in coreano",
      clear: "Cancella", clearCaptions: "Cancella i sottotitoli", microphone: "Microfono", spokenLanguage: "Lingua parlata",
      start: "Attiva il microfono", cancel: "Annulla l’attivazione", stop: "Disattiva il microfono", stopping: "Disattivazione…",
      micIdle: "Consenti l’accesso al microfono quando richiesto.", micStarting: "Consenti l’accesso al microfono se il browser lo chiede.",
      micLive: "In ascolto. Parla con frasi brevi.", micReconnecting: "Riconnessione del microfono…",
      micStopping: "Elaborazione dell’ultima frase…", micUnavailable: "Il riconoscimento vocale non è disponibile qui. Apri la pagina in Chrome o scrivi un messaggio.",
      errPermission: "L’accesso al microfono è bloccato. Consentilo nelle impostazioni del sito o scrivi un messaggio.",
      errService: "Il riconoscimento vocale non è disponibile. Prova Chrome o scrivi un messaggio.",
      errDevice: "Microfono non trovato. Collegane uno o scrivi un messaggio.",
      errNetwork: "Il servizio vocale non è raggiungibile. Controlla la connessione o scrivi un messaggio.",
      errLanguage: "Il browser non riconosce questa lingua. Scegline un’altra o scrivi un messaggio.",
      errStopped: "Il microfono si è fermato. Riattivalo o scrivi un messaggio.",
      errAndroidSpeech: "Il riconoscimento vocale di Android si è interrotto. Riapri Malbit in Chrome e controlla l’accesso al microfono, oppure usa il microfono della tastiera in Scrivi un messaggio.",
      errSilence: "Nessuna voce rilevata. Riprova parlando più vicino al microfono.",
      type: "Scrivi un messaggio", example: "Mostra un esempio", cleared: "I sottotitoli si cancellano quando ricarichi la pagina.",
      github: "Contribuisci su GitHub",
      processing: "Come vengono elaborati voce e traduzioni", shareTitle: "Condividi Malbit", shareClose: "Chiudi condivisione",
      close: "Chiudi", qrAlt: "Codice QR per aprire Malbit", scan: "Scansiona per aprire Malbit su un altro dispositivo.",
      publicLink: "Link pubblico", copy: "Copia il link", copied: "Link copiato.", copyFallback: "Link selezionato. Copialo per condividerlo.",
      helpTitle: "Usate Malbit insieme",
      helpScreen: "Apri questa pagina in Chrome, se possibile, e posiziona lo schermo in modo che il tuo amico possa vederlo.",
      helpStart: "Scegli la lingua che parlerai, attiva il microfono e consenti l’accesso.",
      helpSpeak: "Parla con frasi brevi. I sottotitoli possono cambiare fino alla fine della frase.",
      helpRead: "Espandi la vista per ingrandire i sottotitoli. Puoi anche scrivere un messaggio.",
      providers: "Servizi di riconoscimento vocale e traduzione",
      providerAudio: "Il browser può inviare l’audio al proprio servizio di riconoscimento vocale.",
      providerTranslation: "Chrome traduce sul dispositivo se il pacchetto linguistico è pronto. Altrimenti Malbit invia il testo a MyMemory per tradurlo. MyMemory ha un limite giornaliero gratuito.",
      providerStorage: "Malbit conserva i sottotitoli in questa scheda.", providerTerms: "Termini di MyMemory",
      messageIn: "Messaggio in {language}", placeholder: "Scrivi qualcosa da tradurre…",
      typeIdle: "La traduzione appare nell’area dei sottotitoli.", showKorean: "Mostra in coreano", translating: "Traduzione in corso…",
      quota: "Hai raggiunto il limite giornaliero della traduzione online. Riprova domani o usa la traduzione sul dispositivo di Chrome.",
      translateFailed: "Traduzione non riuscita. Controlla la connessione e riprova."
    },
    es: {
      siteLanguage: "Idioma del sitio",
      share: "Compartir", help: "Cómo se usa", hero: "Subtítulos en coreano en directo",
      tagline: "Habla en tu idioma. Tu amigo podrá leer los subtítulos en coreano.",
      captionSize: "Tamaño de los subtítulos", smaller: "Reducir el tamaño", larger: "Aumentar el tamaño",
      expand: "Ampliar la vista de subtítulos", collapse: "Salir de la vista ampliada", captions: "Subtítulos en coreano",
      clear: "Borrar", clearCaptions: "Borrar subtítulos", microphone: "Micrófono", spokenLanguage: "Idioma hablado",
      start: "Activar micrófono", cancel: "Cancelar activación", stop: "Desactivar micrófono", stopping: "Desactivando…",
      micIdle: "Permite el acceso al micrófono cuando se solicite.", micStarting: "Permite el acceso al micrófono si tu navegador lo solicita.",
      micLive: "Escuchando. Habla con frases cortas.", micReconnecting: "Volviendo a conectar el micrófono…",
      micStopping: "Procesando la última frase…", micUnavailable: "Aquí no está disponible el reconocimiento de voz. Abre la página en Chrome o escribe un mensaje.",
      errPermission: "El acceso al micrófono está bloqueado. Permítelo en los ajustes del sitio o escribe un mensaje.",
      errService: "El reconocimiento de voz no está disponible. Prueba Chrome o escribe un mensaje.",
      errDevice: "No se encontró ningún micrófono. Conecta uno o escribe un mensaje.",
      errNetwork: "No se puede conectar con el servicio de voz. Comprueba tu conexión o escribe un mensaje.",
      errLanguage: "El navegador no reconoce este idioma. Elige otro o escribe un mensaje.",
      errStopped: "El micrófono se detuvo. Vuelve a activarlo o escribe un mensaje.",
      errAndroidSpeech: "El reconocimiento de voz de Android se detuvo. Abre Malbit en Chrome y revisa el permiso del micrófono, o usa el micrófono del teclado en Escribir un mensaje.",
      errSilence: "No se detectó voz. Vuelve a intentarlo y habla más cerca del micrófono.",
      type: "Escribir un mensaje", example: "Ver un ejemplo", cleared: "Los subtítulos se borran al recargar la página.",
      github: "Colabora en GitHub",
      processing: "Cómo se procesan la voz y la traducción", shareTitle: "Compartir Malbit", shareClose: "Cerrar el menú Compartir",
      close: "Cerrar", qrAlt: "Código QR para abrir Malbit", scan: "Escanea el código para abrir Malbit en otro dispositivo.",
      publicLink: "Enlace público", copy: "Copiar enlace", copied: "Enlace copiado.", copyFallback: "Enlace seleccionado. Cópialo para compartirlo.",
      helpTitle: "Usar Malbit en compañía",
      helpScreen: "Abre esta página en Chrome si puedes. Coloca la pantalla donde tu amigo pueda verla.",
      helpStart: "Elige el idioma que vas a hablar, activa el micrófono y permite el acceso.",
      helpSpeak: "Habla con frases cortas. Los subtítulos pueden cambiar hasta que termines la frase.",
      helpRead: "Amplía la vista para ver subtítulos más grandes. También puedes escribir un mensaje.",
      providers: "Servicios de voz y traducción",
      providerAudio: "El navegador puede enviar audio a su servicio de reconocimiento de voz.",
      providerTranslation: "Chrome traduce en tu dispositivo si el paquete de idioma está listo. En caso contrario, Malbit envía el texto a MyMemory para traducirlo. MyMemory tiene un límite diario gratuito.",
      providerStorage: "Malbit guarda los subtítulos en esta pestaña.", providerTerms: "Condiciones de MyMemory",
      messageIn: "Mensaje en {language}", placeholder: "Escribe algo para traducir…",
      typeIdle: "La traducción aparece en la pantalla de subtítulos.", showKorean: "Mostrar en coreano", translating: "Traduciendo…",
      quota: "Se alcanzó el límite diario de traducción en línea. Vuelve mañana o usa la traducción de Chrome en el dispositivo.",
      translateFailed: "No se pudo traducir. Comprueba tu conexión y vuelve a intentarlo."
    },
    fr: {
      siteLanguage: "Langue du site",
      share: "Partager", help: "Mode d’emploi", hero: "Sous-titres en coréen en direct",
      tagline: "Parlez dans votre langue. Votre ami peut lire les sous-titres en coréen.",
      captionSize: "Taille des sous-titres", smaller: "Réduire la taille", larger: "Agrandir les sous-titres",
      expand: "Agrandir la zone de sous-titres", collapse: "Quitter la vue agrandie", captions: "Sous-titres en coréen",
      clear: "Effacer", clearCaptions: "Effacer les sous-titres", microphone: "Microphone", spokenLanguage: "Langue parlée",
      start: "Activer le micro", cancel: "Annuler l’activation", stop: "Désactiver le micro", stopping: "Désactivation…",
      micIdle: "Autorisez l’accès au microphone lorsque le navigateur le demande.", micStarting: "Autorisez le microphone si votre navigateur le demande.",
      micLive: "À l’écoute. Parlez par phrases courtes.", micReconnecting: "Reconnexion du microphone…",
      micStopping: "Traitement de la dernière phrase…", micUnavailable: "La reconnaissance vocale est indisponible ici. Ouvrez la page dans Chrome ou saisissez un message.",
      errPermission: "L’accès au micro est bloqué. Autorisez-le dans les paramètres du site ou saisissez un message.",
      errService: "La reconnaissance vocale est indisponible. Essayez Chrome ou saisissez un message.",
      errDevice: "Aucun microphone détecté. Connectez-en un ou saisissez un message.",
      errNetwork: "Le service vocal est inaccessible. Vérifiez votre connexion ou saisissez un message.",
      errLanguage: "Le navigateur ne reconnaît pas cette langue. Choisissez-en une autre ou saisissez un message.",
      errStopped: "Le microphone s’est arrêté. Réactivez-le ou saisissez un message.",
      errAndroidSpeech: "La reconnaissance vocale d’Android s’est arrêtée. Rouvrez Malbit dans Chrome et vérifiez l’accès au micro, ou utilisez le micro du clavier dans Saisir un message.",
      errSilence: "Aucune voix détectée. Réessayez en parlant plus près du microphone.",
      type: "Saisir un message", example: "Voir un exemple", cleared: "Les sous-titres s’effacent quand vous rechargez la page.",
      github: "Contribuer sur GitHub",
      processing: "Traitement de la voix et de la traduction", shareTitle: "Partager Malbit", shareClose: "Fermer le partage",
      close: "Fermer", qrAlt: "Code QR pour ouvrir Malbit", scan: "Scannez le code pour ouvrir Malbit sur un autre appareil.",
      publicLink: "Lien public", copy: "Copier le lien", copied: "Lien copié.", copyFallback: "Lien sélectionné. Copiez-le pour le partager.",
      helpTitle: "Utiliser Malbit ensemble",
      helpScreen: "Ouvrez cette page dans Chrome si possible. Placez l’écran de façon à ce que votre ami puisse le voir.",
      helpStart: "Choisissez la langue que vous parlerez, activez le micro et autorisez l’accès.",
      helpSpeak: "Parlez par phrases courtes. Les sous-titres peuvent changer jusqu’à la fin de la phrase.",
      helpRead: "Agrandissez la vue pour lire les sous-titres en grand. Vous pouvez aussi saisir un message.",
      providers: "Services de reconnaissance vocale et de traduction",
      providerAudio: "Votre navigateur peut envoyer l’audio à son service de reconnaissance vocale.",
      providerTranslation: "Chrome traduit sur l’appareil lorsque le module linguistique est prêt. Sinon, Malbit envoie le texte à MyMemory pour le traduire. L’utilisation gratuite de MyMemory est limitée par jour.",
      providerStorage: "Malbit conserve les sous-titres dans cet onglet.", providerTerms: "Conditions de MyMemory",
      messageIn: "Message en {language}", placeholder: "Écrivez un texte à traduire…",
      typeIdle: "La traduction apparaît dans la zone de sous-titres.", showKorean: "Afficher en coréen", translating: "Traduction en cours…",
      quota: "La limite quotidienne de traduction en ligne est atteinte. Réessayez demain ou utilisez la traduction intégrée à Chrome.",
      translateFailed: "La traduction a échoué. Vérifiez votre connexion et réessayez."
    },
    de: {
      siteLanguage: "Sprache der Website",
      share: "Teilen", help: "Anleitung", hero: "Koreanische Live-Untertitel",
      tagline: "Sprich in deiner Sprache. Dein Freund kann auf Koreanisch mitlesen.",
      captionSize: "Untertitelgröße", smaller: "Untertitel verkleinern", larger: "Untertitel vergrößern",
      expand: "Untertitelansicht vergrößern", collapse: "Vergrößerte Ansicht schließen", captions: "Koreanische Untertitel",
      clear: "Löschen", clearCaptions: "Untertitel löschen", microphone: "Mikrofon", spokenLanguage: "Gesprochene Sprache",
      start: "Mikrofon einschalten", cancel: "Aktivierung abbrechen", stop: "Mikrofon ausschalten", stopping: "Wird ausgeschaltet…",
      micIdle: "Erlaube den Mikrofonzugriff, wenn du danach gefragt wirst.", micStarting: "Erlaube den Mikrofonzugriff, wenn der Browser danach fragt.",
      micLive: "Hört zu. Sprich in kurzen Sätzen.", micReconnecting: "Mikrofon wird erneut verbunden…",
      micStopping: "Der letzte Satz wird verarbeitet…", micUnavailable: "Spracherkennung ist hier nicht verfügbar. Öffne die Seite in Chrome oder tippe eine Nachricht.",
      errPermission: "Der Mikrofonzugriff ist blockiert. Erlaube ihn in den Website-Einstellungen oder tippe eine Nachricht.",
      errService: "Die Spracherkennung ist nicht verfügbar. Probiere Chrome oder tippe eine Nachricht.",
      errDevice: "Kein Mikrofon gefunden. Schließe eins an oder tippe eine Nachricht.",
      errNetwork: "Der Sprachdienst ist nicht erreichbar. Prüfe deine Verbindung oder tippe eine Nachricht.",
      errLanguage: "Der Browser erkennt diese Sprache nicht. Wähle eine andere oder tippe eine Nachricht.",
      errStopped: "Das Mikrofon wurde unerwartet ausgeschaltet. Schalte es wieder ein oder tippe eine Nachricht.",
      errAndroidSpeech: "Die Android-Spracherkennung wurde beendet. Öffne Malbit erneut in Chrome und prüfe den Mikrofonzugriff oder nutze das Tastaturmikrofon unter Nachricht schreiben.",
      errSilence: "Keine Sprache erkannt. Schalte das Mikrofon erneut ein und sprich näher hinein.",
      type: "Nachricht schreiben", example: "Beispiel anzeigen", cleared: "Beim Neuladen werden die Untertitel gelöscht.",
      github: "Auf GitHub mitwirken",
      processing: "So werden Sprache und Übersetzung verarbeitet", shareTitle: "Malbit teilen", shareClose: "Teilen schließen",
      close: "Schließen", qrAlt: "QR-Code zum Öffnen von Malbit", scan: "Scanne den Code, um Malbit auf einem anderen Gerät zu öffnen.",
      publicLink: "Öffentlicher Link", copy: "Link kopieren", copied: "Link kopiert.", copyFallback: "Link ausgewählt. Kopiere ihn zum Teilen.",
      helpTitle: "Malbit gemeinsam nutzen",
      helpScreen: "Öffne diese Seite möglichst in Chrome. Stelle den Bildschirm so auf, dass dein Freund ihn sehen kann.",
      helpStart: "Wähle die Sprache, in der du sprichst, schalte das Mikrofon ein und erlaube den Zugriff.",
      helpSpeak: "Sprich in kurzen Sätzen. Die Untertitel können sich bis zum Satzende ändern.",
      helpRead: "Vergrößere die Ansicht für größere Untertitel. Du kannst auch eine Nachricht schreiben.",
      providers: "Dienste für Spracherkennung und Übersetzung",
      providerAudio: "Dein Browser kann Audio an seinen Spracherkennungsdienst senden.",
      providerTranslation: "Chrome übersetzt auf dem Gerät, wenn das Sprachpaket bereit ist. Andernfalls sendet Malbit den Text zur Übersetzung an MyMemory. Für MyMemory gilt ein kostenloses Tageslimit.",
      providerStorage: "Malbit speichert die Untertitel in diesem Tab.", providerTerms: "Nutzungsbedingungen von MyMemory",
      messageIn: "Nachricht auf {language}", placeholder: "Schreibe etwas zum Übersetzen…",
      typeIdle: "Die Übersetzung erscheint im Untertitelfenster.", showKorean: "Auf Koreanisch anzeigen", translating: "Wird übersetzt…",
      quota: "Das Tageslimit für Online-Übersetzungen ist erreicht. Versuche es morgen erneut oder nutze Chromes Übersetzung auf dem Gerät.",
      translateFailed: "Übersetzung fehlgeschlagen. Prüfe deine Verbindung und versuche es erneut."
    },
    ja: {
      siteLanguage: "サイトの言語",
      share: "共有", help: "使い方", hero: "リアルタイム韓国語字幕",
      tagline: "好きな言語で話すと、相手は韓国語の字幕を読めます。",
      captionSize: "字幕のサイズ", smaller: "字幕を小さくする", larger: "字幕を大きくする",
      expand: "字幕画面を拡大", collapse: "字幕画面の拡大を終了", captions: "韓国語字幕",
      clear: "消去", clearCaptions: "字幕を消去", microphone: "マイク", spokenLanguage: "話す言語",
      start: "マイクをオン", cancel: "接続をキャンセル", stop: "マイクをオフ", stopping: "停止中…",
      micIdle: "確認が表示されたらマイクの使用を許可してください。", micStarting: "ブラウザーから求められたらマイクの使用を許可してください。",
      micLive: "聞き取り中です。短い文で話してください。", micReconnecting: "マイクを再接続しています…",
      micStopping: "最後の文を処理しています…", micUnavailable: "ここでは音声認識を使えません。Chrome で開くか、メッセージを入力してください。",
      errPermission: "マイクの使用がブロックされています。サイト設定で許可するか、メッセージを入力してください。",
      errService: "音声認識を使えません。Chrome で開くか、メッセージを入力してください。",
      errDevice: "マイクが見つかりません。マイクを接続するか、メッセージを入力してください。",
      errNetwork: "音声認識サービスに接続できません。通信状態を確認するか、メッセージを入力してください。",
      errLanguage: "ブラウザーはこの言語を認識できません。別の言語を選ぶか、メッセージを入力してください。",
      errStopped: "マイクが停止しました。再度オンにするか、メッセージを入力してください。",
      errAndroidSpeech: "Android の音声認識が終了しました。Chrome で Malbit を開き直してマイクの許可を確認するか、メッセージ入力でキーボードのマイクを使ってください。",
      errSilence: "音声を検出できませんでした。マイクをオンにして、近くで話してください。",
      type: "メッセージを入力", example: "例を見る", cleared: "再読み込みすると字幕が消えます。",
      github: "GitHub で改善に参加",
      processing: "音声認識と翻訳の仕組み", shareTitle: "Malbit を共有", shareClose: "共有を閉じる",
      close: "閉じる", qrAlt: "Malbit を開く QR コード", scan: "スキャンすると別の端末で Malbit が開きます。",
      publicLink: "公開リンク", copy: "リンクをコピー", copied: "リンクをコピーしました。", copyFallback: "リンクを選択しました。コピーして共有してください。",
      helpTitle: "Malbit の使い方",
      helpScreen: "できれば Chrome で開き、相手が画面を見られるようにしてください。",
      helpStart: "話す言語を選び、マイクをオンにして、使用を許可してください。",
      helpSpeak: "短い文で話してください。文が終わるまで字幕が変わることがあります。",
      helpRead: "字幕画面を拡大すると、大きな文字で読めます。メッセージを入力することもできます。",
      providers: "音声認識と翻訳のサービス",
      providerAudio: "ブラウザーは音声を音声認識サービスに送信することがあります。",
      providerTranslation: "Chrome の言語パックが準備できている場合は端末上で翻訳します。それ以外の場合、Malbit は翻訳するテキストを MyMemory に送信します。MyMemory には無料利用の上限があります。",
      providerStorage: "字幕は開いているタブに保存されます。", providerTerms: "MyMemory の利用規約",
      messageIn: "メッセージ（{language}）", placeholder: "翻訳する内容を入力…",
      typeIdle: "翻訳は字幕画面に表示されます。", showKorean: "韓国語で表示", translating: "翻訳中…",
      quota: "オンライン翻訳の上限に達しました。明日もう一度試すか、Chrome の端末上の翻訳をお使いください。",
      translateFailed: "翻訳できませんでした。通信状態を確認して再度お試しください。"
    },
    "zh-CN": {
      siteLanguage: "网站语言",
      share: "分享", help: "使用方法", hero: "实时韩语字幕",
      tagline: "用您熟悉的语言说话，朋友就能看到韩语字幕。",
      captionSize: "字幕大小", smaller: "缩小字幕", larger: "放大字幕",
      expand: "放大字幕视图", collapse: "退出放大字幕视图", captions: "韩语字幕",
      clear: "清空", clearCaptions: "清空字幕", microphone: "麦克风", spokenLanguage: "说话语言",
      start: "开启麦克风", cancel: "取消开启", stop: "关闭麦克风", stopping: "正在关闭…",
      micIdle: "出现提示时，请允许使用麦克风。", micStarting: "如果浏览器弹出提示，请允许使用麦克风。",
      micLive: "正在聆听，请用简短的句子说话。", micReconnecting: "正在重新连接麦克风…",
      micStopping: "正在处理最后一句话…", micUnavailable: "此处无法使用语音识别。请在 Chrome 中打开，或输入消息。",
      errPermission: "麦克风权限已被阻止。请在浏览器网站设置中允许访问，或输入消息。",
      errService: "无法使用浏览器的语音识别。请尝试用 Chrome 打开，或输入消息。",
      errDevice: "未找到麦克风。请连接麦克风，或输入消息。",
      errNetwork: "无法连接语音识别服务。请检查网络，或输入消息。",
      errLanguage: "浏览器无法识别这种语言。请选择其他语言，或输入消息。",
      errStopped: "麦克风意外停止。请重新开启，或输入消息。",
      errAndroidSpeech: "Android 语音识别已结束。请在 Chrome 中重新打开 Malbit 并检查麦克风权限，或在输入消息中使用键盘麦克风。",
      errSilence: "未检测到语音。请重新开启麦克风，靠近麦克风说话。",
      type: "输入消息", example: "查看示例", cleared: "重新加载页面会清空字幕。",
      github: "在 GitHub 上参与改进",
      processing: "语音与翻译的处理方式", shareTitle: "分享 Malbit", shareClose: "关闭分享",
      close: "关闭", qrAlt: "用于打开 Malbit 的二维码", scan: "扫描二维码，在其他设备上打开 Malbit。",
      publicLink: "公开链接", copy: "复制链接", copied: "链接已复制。", copyFallback: "已选中链接。请复制后分享。",
      helpTitle: "一起使用 Malbit",
      helpScreen: "如有可能，请在 Chrome 中打开此页面，并将屏幕放在朋友看得到的位置。",
      helpStart: "选择您要说的语言，开启麦克风并允许访问。",
      helpSpeak: "请用简短的句子说话。一句话说完之前，字幕可能会更新。",
      helpRead: "放大字幕视图可以看到更大的文字。您也可以输入消息。",
      providers: "语音识别和翻译服务",
      providerAudio: "浏览器可能会将音频发送到其语音识别服务。",
      providerTranslation: "Chrome 语言包就绪后，会在设备上进行翻译。否则，Malbit 会将文本发送到 MyMemory 进行翻译。MyMemory 有每日免费用量限制。",
      providerStorage: "Malbit 将字幕保存在当前标签页中。", providerTerms: "MyMemory 服务条款",
      messageIn: "输入消息（{language}）", placeholder: "输入要翻译的内容…",
      typeIdle: "译文会显示在字幕区。", showKorean: "显示韩语", translating: "正在翻译…",
      quota: "已达到在线翻译的每日用量限制。请明天重试，或使用 Chrome 的设备端翻译。",
      translateFailed: "翻译失败。请检查网络连接后重试。"
    }
  };

  const picker = document.getElementById("site-language");
  const spokenOptions = Array.from(document.getElementById("language").options);
  const englishNames = spokenOptions.map((option) => option.textContent);
  const storageKey = "malbit.siteLanguage";
  let locale = "en";

  function supported(code) {
    return Object.hasOwn(messages, code);
  }

  function preferredLocale() {
    try {
      const saved = localStorage.getItem(storageKey);
      if (supported(saved)) return saved;
    } catch {
      // Language switching also works when browser storage is blocked.
    }
    for (const preference of navigator.languages || [navigator.language]) {
      const base = preference.split("-")[0].toLowerCase();
      const supportedCode = base === "zh" ? "zh-CN" : base;
      if (supported(supportedCode)) return supportedCode;
    }
    return "en";
  }

  function t(key) {
    return messages[locale][key] ?? messages.en[key];
  }

  function applyLocale(code) {
    locale = code;
    picker.value = code;
    document.documentElement.lang = code;
    document.title = "말빛 · " + t("hero");

    for (const element of document.querySelectorAll("[data-i18n]")) {
      element.textContent = t(element.dataset.i18n);
    }
    for (const attribute of ["aria-label", "title", "alt", "placeholder", "content"]) {
      const source = "data-i18n-" + attribute;
      for (const element of document.querySelectorAll("[" + source + "]")) {
        element.setAttribute(attribute, t(element.getAttribute(source)));
      }
    }

    const names = code !== "en" && Intl.DisplayNames
      ? new Intl.DisplayNames([code], { type: "language", languageDisplay: "standard" })
      : null;
    spokenOptions.forEach((option, index) => {
      const tag = option.value === "zh-CN" ? "zh-Hans" : option.value.startsWith("en-") ? option.value : option.value.split("-")[0];
      option.textContent = names?.of(tag) || englishNames[index];
    });
  }

  applyLocale(preferredLocale());
  picker.addEventListener("change", () => {
    if (!supported(picker.value)) return;
    applyLocale(picker.value);
    try {
      localStorage.setItem(storageKey, locale);
    } catch {
      // The choice stays active in this tab.
    }
    document.dispatchEvent(new Event("malbit:languagechange"));
  });
  window.malbitI18n = { t };
})();
