// Signer-facing copy in English and Spanish.
//
// Only what a signer sees is translated here: the signing pages, the legal
// notices a signer is shown, and the emails a signer receives. The
// dashboard stays in English, so settings, envelopes and templates have no
// keys here. The organization picks the language once, under Settings,
// Organization (the "signer language" setting); there is no per-signer
// choice, and the disclosure version stored with each agreement shows
// which words a signer saw.

export const SIGNER_LANGUAGES = ["en", "es"] as const;

export type SignerLocale = (typeof SIGNER_LANGUAGES)[number];

export const en = {
  "error.completeRequired": "Complete all required fields before finishing.",
  "error.credentials.identityNotConfirmed":
    "Your account cannot sign this document right now: an administrator has to confirm your identity, and your email address must be confirmed. Ask the sender or an administrator.",
  "error.credentials.locked":
    "This account is locked for signing after {attempts} wrong passwords. Ask an administrator to unlock it.",
  "error.credentials.wrongMany":
    "That email address or password is not right. {count} tries are left before the account is locked for signing.",
  "error.credentials.wrongOne":
    "That email address or password is not right. {count} try is left before the account is locked for signing.",
  "error.disclosureChanged":
    "The disclosure has changed. Reload the page to read the current one.",
  "error.documentChanged":
    "The document changed while you were signing. Open your signing link again.",
  "error.drawnEmpty": "Drawn signature image data is empty.",
  "error.drawnMustBePng": "Drawn signatures must be submitted as PNG images.",
  "error.drawnTooLarge": "Drawn signature image data is too large.",
  "error.dropdownEntry": "Choose one of the listed options in each dropdown.",
  "error.envelopeChangedWhileDeclining":
    "This envelope changed while you were declining. Open your signing link again.",
  "error.fieldOnce": "Each field can only be submitted once.",
  "error.fieldSaveFailed": "Unable to save one or more field values.",
  "error.finalizeFailed": "Unable to finalize this completed envelope.",
  "error.linkInactive": "This signing link is no longer active.",
  "error.needConsent":
    "Agree to use electronic records and signatures before signing.",
  "error.nextSignerActivate":
    "Unable to activate the next signer for this envelope.",
  "error.noCodeNeeded": "No code is needed for this link.",
  "error.noFieldsAssigned": "No signable fields are assigned to this signer.",
  "error.notProviderSigned":
    "This document is not signed through a signing provider.",
  "error.numberEntry": "Enter a number, such as 1250 or 12.5.",
  "error.part11NoAccount":
    "This document was sent for Part 11 signatures but has no account or meaning for you. Ask the sender to send it again.",
  "error.providerRequired":
    "This document is signed with a certificate in your own name. Continue from the signing page.",
  "error.radioTooMany":
    "Choose only one option in each group of radio buttons.",
  "error.sessionEnded": "This signing session has ended.",
  "error.sourceMissing":
    "The source document for this envelope could not be found.",
  "error.codeExpired": "That code has expired. Send a new one.",
  "error.codeWrong": "That code is not right.",
  "error.checkNotNeeded": "This check is not needed.",
  "error.enterCredentials": "Enter your email address and password to sign.",
  "field.canvas.checkbox": "Checkbox",
  "field.canvas.date": "Date",
  "field.canvas.dropdown": "Choose",
  "field.canvas.fallback": "Field",
  "field.canvas.initials": "Initial",
  "field.canvas.name": "Name",
  "field.canvas.number": "Number",
  "field.canvas.radio": "Option",
  "field.canvas.signature": "Sign",
  "field.canvas.text": "Text",
  "field.label.checkbox": "Checkbox",
  "field.label.date": "Date",
  "field.label.dropdown": "Choose one",
  "field.label.fallback": "Field",
  "field.label.initials": "Initial here",
  "field.label.name": "Name",
  "field.label.number": "Enter a number",
  "field.label.radio": "Option",
  "field.label.signature": "Sign here",
  "field.label.text": "Enter text",
  "field.noun.initials": "initials",
  "field.noun.signature": "signature",
  "field.summary.checkbox": "Checkbox",
  "field.summary.date": "Date",
  "field.summary.dropdown": "Dropdown",
  "field.summary.fallback": "Field",
  "field.summary.initials": "Initials",
  "field.summary.name": "Name",
  "field.summary.number": "Number",
  "field.summary.radio": "Choice",
  "field.summary.signature": "Signature",
  "field.summary.text": "Text input",
  "consentDialog.agree": "Agree and continue",
  "consentDialog.checkboxAria":
    "I agree to use electronic records and signatures",
  "consentDialog.description":
    "{sender} sent you \u201c{title}\u201d to sign electronically.",
  "consentDialog.saveError": "Your agreement could not be saved right now.",
  "consentDialog.title": "Before you sign",
  "declineDialog.cancel": "Cancel",
  "declineDialog.declineToSign": "Decline to sign",
  "declineDialog.declining": "Declining...",
  "declineDialog.description":
    "The sender ({sender}) will be notified that you declined. This cannot be undone.",
  "declineDialog.reason": "Reason (optional)",
  "declineDialog.reasonPlaceholder": "I'd like to discuss some terms first...",
  "declineDialog.title": "Decline to sign?",
  "disclosure.contactAt": "{sender} at {contact}",
  "disclosure.consent":
    "I have read the disclosure above, I can open and save PDF files on this device, and I agree to use electronic records and signatures for this document.",
  "disclosure.covers.heading": "This agreement covers",
  "disclosure.covers.text":
    "This document and the notices about it that are sent to you through this site.",
  "disclosure.needs.heading": "What you need",
  "disclosure.needs.text":
    "A current web browser and a device that can open and save PDF files. You will receive the signed document by email, so keep your email address up to date with the sender. Download and keep the signed copy: it is your record.",
  "disclosure.paper.heading": "You can choose paper instead",
  "disclosure.paper.text":
    "You do not have to agree. To sign on paper instead, or to ask for a paper copy of any document after signing, contact {contact}. A paper copy is free unless {sender} tells you otherwise before you ask.",
  "disclosure.using.heading": "Using electronic records and signatures",
  "disclosure.using.text":
    "{sender} asks you to receive this document and sign it electronically instead of on paper. If you agree, your electronic signature has the same effect as a handwritten one, and the documents you receive this way count as delivered to you in writing.",
  "disclosure.withdraw.heading": "Withdrawing your agreement",
  "disclosure.withdraw.text":
    "You can withdraw this agreement at any time before you sign by declining or by telling {contact}. Withdrawing does not undo a signature you already gave.",
  "done.closeTab": "You can close this tab.",
  "done.emailComing":
    "You'll receive an email with the signed document once all parties have signed.",
  "done.fallbackTitle": "this document",
  "done.recorded": "Your signature has been recorded for \u201c{title}\u201d.",
  "done.title": "You're all done.",
  "email.code.line": "Your code to open \u201c{title}\u201d in {product} is:",
  "email.code.subject": "Your code for \u201c{title}\u201d",
  "email.code.valid":
    "It works for {minutes} minutes. If you did not just open a signing link, ignore this email.",
  "email.completion.attached":
    "The completed document and its certificate are attached. Keep them: they are your copy of the agreement.",
  "email.completion.copyLine": "{sender} asked for you to receive a copy.",
  "email.completion.fromSender":
    "\u201c{title}\u201d from {sender} has been fully signed in {product}.",
  "email.completion.linksHeading":
    "Download links (available for {days} days; an expired link offers to send a new one):",
  "email.completion.linksNote":
    "Download links are available for {days} days. An expired link offers to send a new one.",
  "email.completion.ready":
    "The completed document and its certificate are ready.",
  "email.completion.subject": "\u201c{title}\u201d is fully signed",
  "email.cta": "Review and sign the document",
  "email.deadlineLine": "This request expires on {date}.",
  "email.downloadCertificate": "Download certificate",
  "email.downloadRedactedCertificate": "Download redacted certificate",
  "email.downloadSigned": "Download signed PDF",
  "email.footer.contact": "Contact",
  "email.footer.privacyNotice": "Privacy notice",
  "email.footer.privacyPolicy": "Privacy Policy",
  "email.footer.questions": "Questions? Contact {address}.",
  "email.footer.sentByOrg": "Sent by {organization} using {product}.",
  "email.footer.sentByProduct": "Sent using {product}.",
  "email.footer.terms": "Terms of Service",
  "email.greeting": "Hi {name},",
  "email.invitation.sent":
    "{sender} sent you \u201c{title}\u201d through {product}.",
  "email.invitation.subject":
    "{sender} requested your signature on \u201c{title}\u201d",
  "email.newestLink":
    "If you receive a newer invitation or reminder link, use the newest one.",
  "email.noAccount": "You do not need a {product} account to sign.",
  "email.reminder.auto.intro":
    "{sender} is still waiting for your signature on \u201c{title}\u201d, sent through {product}.",
  "email.reminder.auto.subject":
    "Reminder: {sender} is waiting for your signature on \u201c{title}\u201d",
  "email.reminder.manual.intro":
    "{sender} sent you a reminder to sign \u201c{title}\u201d through {product}.",
  "email.reminder.manual.subject":
    "{sender} sent you a reminder to sign \u201c{title}\u201d",
  "email.renewal.keep":
    "Download and keep the files: they are your copy of the record.",
  "email.renewal.line":
    "Here are new download links for \u201c{title}\u201d in {product}. They work for {days} days.",
  "email.renewal.subject": "New download links for \u201c{title}\u201d",
  "email.text.certificateLabel": "Certificate",
  "email.text.redactedCertificateLabel": "Redacted certificate",
  "email.text.signedPdfLabel": "Signed PDF",
  "email.voided.body": "{sender} voided \u201c{title}\u201d in {product}.",
  "email.voided.note":
    "The signing process has been canceled. No further action is needed.",
  "email.voided.subject": "\u201c{title}\u201d was voided by {sender}",
  "finishDialog.advanced":
    "This document asks for an advanced electronic signature, made with a certificate in your own name.",
  "finishDialog.back": "Back",
  "finishDialog.confirmMeaning":
    "I confirm this meaning. My name, the date and time, and this meaning will be printed with my signature.",
  "finishDialog.confirmMeaningAria": "I confirm the meaning of my signature",
  "finishDialog.continueToProvider": "Continue to {provider}",
  "finishDialog.description":
    "You are signing \u201c{title}\u201d from {sender}.",
  "finishDialog.emailAddress": "Email address",
  "finishDialog.enterCredentials":
    "Enter your account's email address and password to sign.",
  "finishDialog.finishing": "Finishing...",
  "finishDialog.finishSigning": "Finish signing",
  "finishDialog.meaningOfSignature": "Meaning of your signature",
  "finishDialog.password": "Password",
  "finishDialog.plainConfirm":
    "By clicking Finish, you confirm that your electronic signature is intended to be binding for this document.",
  "finishDialog.preparing": "Preparing...",
  "finishDialog.providerSteps":
    "Next, {provider} asks you to confirm who you are and to approve the signature. When it is done, you come back here. By continuing, you confirm that your signature is intended to be binding for this document.",
  "finishDialog.qualified":
    "This document asks for a qualified electronic signature, made with a certificate in your own name.",
  "finishDialog.title": "Finish signing?",
  "footer.eSignatures": "E-signatures",
  "footer.eSignaturesLong": "What this is for",
  "footer.poweredBy": "Powered by {name}",
  "footer.privacy": "Privacy",
  "footer.privacyLong": "Privacy Policy",
  "footer.privacyNotice": "Privacy notice",
  "footer.terms": "Terms",
  "footer.termsLong": "Terms of Service",
  "live.allComplete": "All required fields complete",
  "live.assignedFields": "Assigned fields",
  "live.canvasClearedMany": "Canvas cleared {count} times",
  "live.canvasClearedOne": "Canvas cleared once",
  "live.checked": "Checked",
  "live.chooseOne": "Choose one",
  "live.currentSigner": "Current signer",
  "live.currentSignerView": "Current signer view",
  "live.defaultDeclineError":
    "We couldn't record your decline right now. Reload the page or request a fresh signing link from the sender.",
  "live.defaultSubmitError":
    "We couldn't finish signing right now. Reload the page or request a fresh signing link from the sender.",
  "live.decline": "Decline",
  "live.declineConfirm.description":
    "Your decline has been recorded. No further action is needed, and this link no longer opens the document.",
  "live.declineConfirm.title": "You declined to sign",
  "live.documentPage": "Document page",
  "live.downloadPdf": "Download PDF",
  "live.enterANumber": "Enter a number",
  "live.enterText": "Enter text",
  "live.fieldOnPage": "{label} \u00b7 Page {page}",
  "live.finish": "Finish",
  "live.fromSender": "From {sender}",
  "live.lockedFieldsNote":
    "Previous signer values stay visible but locked. Only your assigned fields are interactive.",
  "live.lockedValues": "Locked values visible",
  "live.manyRemaining": "{count} required fields remaining",
  "live.noAnswer": "No answer",
  "live.noFieldsBody":
    "Move between pages to review your assigned fields and any completed values from earlier signers.",
  "live.noFieldsTitle": "No signer fields on this page",
  "live.notANumber": "Not a number",
  "live.numberWarning":
    "A number field marked in red does not hold a number. {message}",
  "live.oneRemaining": "{count} required field remaining",
  "live.optional": "Optional",
  "live.pageOf": "Page {page} of {count}",
  "live.previousPage": "Previous page",
  "live.nextPage": "Next page",
  "live.readyToFinish": "Ready to finish",
  "live.tapToSign": "Tap to sign",
  "live.toolbar.manyRemaining": "{count} required remaining",
  "live.unchecked": "Unchecked",
  "meaning.approval.label": "Approval",
  "meaning.approval.statement": "I approve this document.",
  "meaning.authorship.label": "Authorship",
  "meaning.authorship.statement": "I am the author of this document.",
  "meaning.responsibility.label": "Responsibility",
  "meaning.responsibility.statement":
    "I take responsibility for this document.",
  "meaning.review.label": "Review",
  "meaning.review.statement": "I have reviewed this document.",
  "modal.addInitials": "Add your initials",
  "modal.addSignature": "Add your signature",
  "modal.applyInitials": "Apply initials",
  "modal.applySignature": "Apply signature",
  "modal.canvasAria": "Draw signature canvas",
  "modal.cancel": "Cancel",
  "modal.clear": "Clear",
  "modal.completedAlt": "{signer} completed {fieldType}",
  "modal.description":
    "By signing, you agree that this electronic signature is the legal equivalent of your manual signature.",
  "modal.drawnInitials": "Drawn initials",
  "modal.drawnSignature": "Drawn signature",
  "modal.drawPrompt": "Draw with mouse or finger",
  "modal.drawTab": "Draw",
  "modal.initialsPreviewAlt": "Initials preview",
  "modal.rendered": "Rendered in signature style",
  "modal.signaturePreviewAlt": "Signature preview",
  "modal.typeInitials": "Type initials",
  "modal.typeInitialsPlaceholder": "Type your initials",
  "modal.typeSignature": "Type signature",
  "modal.typeSignaturePlaceholder": "Type your signature",
  "modal.typeTab": "Type",
  "pills.complete": "Complete",
  "pills.fixThis": "Fix this",
  "pills.required": "Required",
  "privacy.basis.body":
    "To let you review and sign the document, to deliver copies, and to keep evidence of who signed what and when. The basis is taking steps for or performing a contract you are part of (GDPR Article 6(1)(b)), the organization's legitimate interest in being able to prove the agreement (Article 6(1)(f)), and any legal duty to keep records (Article 6(1)(c)).",
  "privacy.basis.heading": "Why, and on what basis",
  "privacy.collected.emails":
    "Records of the emails sent to you about the document.",
  "privacy.collected.entries":
    "What you enter: your signature or initials (typed or drawn), dates, text and checkboxes, or your reason for declining.",
  "privacy.collected.evidence":
    "Evidence of signing: when you opened, agreed and signed, your IP address, your browser's description of itself, and the checks you passed (such as an emailed code).",
  "privacy.collected.heading": "What is collected",
  "privacy.collected.name": "Your name and email address, given by the sender.",
  "privacy.description":
    "How your information is used when you sign a document here.",
  "privacy.fallbackOrganization": "The organization that runs this site",
  "privacy.intro":
    "{organization} uses this site to send documents for electronic signature. This notice says what is collected about you when you sign, why, and what you can do about it.",
  "privacy.recipients.body":
    "The other parties to the document see your name, email and signature. The services that run this site process it for {organization}: the hosting provider (Vercel), the database provider (such as Neon), file storage (Vercel Blob) and the email provider (Resend). Some are based in the United States; where information leaves the European Economic Area, it is protected by the EU-US Data Privacy Framework or by standard contractual clauses.",
  "privacy.recipients.heading": "Who else handles it",
  "privacy.responsible.body":
    "{organization} is responsible for your information (the \u201ccontroller\u201d).",
  "privacy.responsible.contactLead": "Contact them at",
  "privacy.responsible.contactTail": ".",
  "privacy.responsible.heading": "Who is responsible",
  "privacy.responsible.noContact":
    "Contact them through the person who sent you the document.",
  "privacy.retention.days":
    "Finished documents and their audit trails are deleted {days} days after they are finished.",
  "privacy.retention.drafts":
    "Unsent drafts are deleted after {days} days without changes.",
  "privacy.retention.heading": "How long it is kept",
  "privacy.retention.untilDeleted":
    "Finished documents and their audit trails are kept until the organization deletes them, because they are evidence of an agreement and many must be kept for years by law.",
  "privacy.rights.body":
    "You can ask {organization} for a copy of your information, to correct it, to restrict or object to its use, or to erase it. A signed record may be kept despite a request to erase it while it is needed as evidence or by law (GDPR Article 17(3)). You can also complain to the data protection authority where you live or work.",
  "privacy.rights.heading": "Your rights",
  "privacy.title": "Privacy notice for signers",
  "providerProblem.cancelled":
    "You did not finish signing at {provider}. Nothing was signed, so you can try again.",
  "providerProblem.expired":
    "Your earlier signing session ended before it finished. Nothing was signed, so you can try again.",
  "providerProblem.failed":
    "{provider} could not complete your signature. Nothing was signed. Try again, or ask the sender for help.",
  "providerProblem.name":
    "The certificate you signed with at {provider} is not in the name this document was sent to. Nothing was signed. If the name is wrong, ask the sender to send the document again under the name on your certificate.",
  "state.alreadySigned.description":
    "You already completed your signature for this document.",
  "state.alreadySigned.title": "You've already signed",
  "state.declined.description":
    "A signer declined this document. No further action is needed.",
  "state.declined.title": "This envelope has been declined",
  "state.error.description":
    "We couldn't load this document right now. Reload the page or request a fresh signing link from the sender.",
  "state.error.title": "Something went wrong. Please try again.",
  "state.expired.description": "Request a new signing link from the sender.",
  "state.expired.title": "This link has expired",
  "state.voided.description":
    "The sender cancelled this document. No further action is needed.",
  "state.voided.title": "This envelope has been voided",
  "verify.accessCodeHelper":
    "The sender gave you this code separately, for example by phone.",
  "verify.accessCodeLabel": "Access code",
  "verify.accountHelper":
    "This document is signed with your own account here. Enter the password you sign in with.",
  "verify.accountLabel": "Password",
  "verify.checkError": "The code could not be checked right now.",
  "verify.codeSent": "A code was sent to {email}.",
  "verify.continue": "Continue",
  "verify.emailAddress": "Email address",
  "verify.emailCodeHelper":
    "We email a 6-digit code to the address this document was sent to.",
  "verify.emailCodeLabel": "Code from your email",
  "verify.emailHelper": "The address this document was sent to ({email}).",
  "verify.emailMeCode": "Email me a code",
  "verify.intro":
    "{sender} asked for a check before you open \u201c{title}\u201d.",
  "verify.sendError": "The code could not be sent right now.",
  "verify.sendNewCode": "Send a new code",
  "verify.step": "Step {step} of {total}.",
  "verify.title": "Confirm it's you",
};

export type SignerMessageKey = keyof typeof en;

export const es: Record<SignerMessageKey, string> = {
  "error.completeRequired":
    "Complete todos los campos obligatorios antes de terminar.",
  "error.credentials.identityNotConfirmed":
    "Su cuenta no puede firmar este documento en este momento: un administrador debe confirmar su identidad y su dirección de correo debe estar confirmada. Pida ayuda al remitente o a un administrador.",
  "error.credentials.locked":
    "Esta cuenta quedó bloqueada para firmar después de {attempts} contraseñas incorrectas. Pida a un administrador que la desbloquee.",
  "error.credentials.wrongMany":
    "Ese correo o esa contraseña no son correctos. Quedan {count} intentos antes de que la cuenta se bloquee para firmar.",
  "error.credentials.wrongOne":
    "Ese correo o esa contraseña no son correctos. Queda {count} intento antes de que la cuenta se bloquee para firmar.",
  "error.disclosureChanged":
    "El aviso ha cambiado. Vuelva a cargar la página para leer el actual.",
  "error.documentChanged":
    "El documento cambió mientras firmaba. Abra de nuevo su enlace de firma.",
  "error.drawnEmpty":
    "Los datos de la imagen de la firma dibujada están vacíos.",
  "error.drawnMustBePng":
    "Las firmas dibujadas deben enviarse como imágenes PNG.",
  "error.drawnTooLarge":
    "Los datos de la imagen de la firma dibujada son demasiado grandes.",
  "error.dropdownEntry":
    "Elija una de las opciones de la lista en cada menú desplegable.",
  "error.envelopeChangedWhileDeclining":
    "Este sobre cambió mientras rechazaba. Abra de nuevo su enlace de firma.",
  "error.fieldOnce": "Cada campo solo puede enviarse una vez.",
  "error.fieldSaveFailed": "No se pudo guardar uno o más valores de campo.",
  "error.finalizeFailed": "No se pudo finalizar este sobre completado.",
  "error.linkInactive": "Este enlace de firma ya no está activo.",
  "error.needConsent":
    "Acepte usar registros y firmas electrónicas antes de firmar.",
  "error.nextSignerActivate":
    "No se pudo activar al siguiente firmante de este sobre.",
  "error.noCodeNeeded": "Este enlace no necesita código.",
  "error.noFieldsAssigned":
    "No hay campos para firmar asignados a este firmante.",
  "error.notProviderSigned":
    "Este documento no se firma a través de un proveedor de firma.",
  "error.numberEntry": "Escriba un número, por ejemplo 1250 o 12.5.",
  "error.part11NoAccount":
    "Este documento se envió para firmas Part 11 pero no tiene cuenta ni significado para usted. Pida al remitente que lo envíe de nuevo.",
  "error.providerRequired":
    "Este documento se firma con un certificado a su nombre. Continúe desde la página de firma.",
  "error.radioTooMany":
    "Elija solo una opción en cada grupo de botones de opción.",
  "error.sessionEnded": "Esta sesión de firma ha terminado.",
  "error.sourceMissing":
    "No se pudo encontrar el documento original de este sobre.",
  "error.codeExpired": "Ese código ha caducado. Envíe uno nuevo.",
  "error.codeWrong": "Ese código no es correcto.",
  "error.checkNotNeeded": "Esta comprobación no es necesaria.",
  "error.enterCredentials": "Escriba su correo y su contraseña para firmar.",
  "field.canvas.checkbox": "Casilla",
  "field.canvas.date": "Fecha",
  "field.canvas.dropdown": "Elegir",
  "field.canvas.fallback": "Campo",
  "field.canvas.initials": "Inicial",
  "field.canvas.name": "Nombre",
  "field.canvas.number": "Número",
  "field.canvas.radio": "Opción",
  "field.canvas.signature": "Firmar",
  "field.canvas.text": "Texto",
  "field.label.checkbox": "Casilla",
  "field.label.date": "Fecha",
  "field.label.dropdown": "Elija una opción",
  "field.label.fallback": "Campo",
  "field.label.initials": "Ponga sus iniciales aquí",
  "field.label.name": "Nombre",
  "field.label.number": "Escriba un número",
  "field.label.radio": "Opción",
  "field.label.signature": "Firme aquí",
  "field.label.text": "Escriba un texto",
  "field.noun.initials": "iniciales",
  "field.noun.signature": "firma",
  "field.summary.checkbox": "Casilla",
  "field.summary.date": "Fecha",
  "field.summary.dropdown": "Desplegable",
  "field.summary.fallback": "Campo",
  "field.summary.initials": "Iniciales",
  "field.summary.name": "Nombre",
  "field.summary.number": "Número",
  "field.summary.radio": "Elección",
  "field.summary.signature": "Firma",
  "field.summary.text": "Texto",
  "consentDialog.agree": "Aceptar y continuar",
  "consentDialog.checkboxAria": "Acepto usar registros y firmas electrónicas",
  "consentDialog.description":
    "{sender} le envió «{title}» para firmarlo electrónicamente.",
  "consentDialog.saveError":
    "No pudimos guardar su aceptación en este momento.",
  "consentDialog.title": "Antes de firmar",
  "declineDialog.cancel": "Cancelar",
  "declineDialog.declineToSign": "Rechazar la firma",
  "declineDialog.declining": "Rechazando...",
  "declineDialog.description":
    "Se notificará al remitente ({sender}) que ha rechazado el documento. Esto no se puede deshacer.",
  "declineDialog.reason": "Motivo (opcional)",
  "declineDialog.reasonPlaceholder":
    "Me gustaría comentar antes algunas condiciones...",
  "declineDialog.title": "¿Rechazar la firma?",
  "disclosure.contactAt": "{sender} en {contact}",
  "disclosure.consent":
    "He leído el aviso anterior, puedo abrir y guardar archivos PDF en este dispositivo, y acepto usar registros y firmas electrónicas para este documento.",
  "disclosure.covers.heading": "Qué cubre esta aceptación",
  "disclosure.covers.text":
    "Este documento y los avisos sobre él que se le envíen a través de este sitio.",
  "disclosure.needs.heading": "Lo que necesita",
  "disclosure.needs.text":
    "Un navegador actual y un dispositivo que pueda abrir y guardar archivos PDF. Recibirá el documento firmado por correo, así que mantenga su dirección de correo al día con el remitente. Descargue y conserve la copia firmada: es su registro.",
  "disclosure.paper.heading": "Puede elegir el papel",
  "disclosure.paper.text":
    "No está obligado a aceptar. Para firmar en papel, o pedir una copia en papel de cualquier documento después de firmar, contacte a {contact}. La copia en papel es gratuita salvo que {sender} le indique lo contrario antes de que la pida.",
  "disclosure.using.heading": "Uso de registros y firmas electrónicas",
  "disclosure.using.text":
    "{sender} le pide recibir este documento y firmarlo electrónicamente en lugar de en papel. Si acepta, su firma electrónica tiene el mismo efecto que una manuscrita, y los documentos que reciba de este modo se consideran entregados por escrito.",
  "disclosure.withdraw.heading": "Retirar su aceptación",
  "disclosure.withdraw.text":
    "Puede retirar esta aceptación en cualquier momento antes de firmar, rechazando el documento o avisando a {contact}. Retirarla no anula una firma que ya haya dado.",
  "done.closeTab": "Puede cerrar esta pestaña.",
  "done.emailComing":
    "Recibirá un correo con el documento firmado cuando todas las partes hayan firmado.",
  "done.fallbackTitle": "este documento",
  "done.recorded": "Su firma ha quedado registrada para «{title}».",
  "done.title": "Ya ha terminado.",
  "email.code.line": "Su código para abrir «{title}» en {product} es:",
  "email.code.subject": "Su código para «{title}»",
  "email.code.valid":
    "Funciona durante {minutes} minutos. Si no acaba de abrir un enlace de firma, ignore este correo.",
  "email.completion.attached":
    "El documento completado y su certificado van adjuntos. Consérvelos: son su copia del acuerdo.",
  "email.completion.copyLine": "{sender} pidió que recibiera una copia.",
  "email.completion.fromSender":
    "«{title}», de {sender}, está completamente firmado en {product}.",
  "email.completion.linksHeading":
    "Enlaces de descarga (disponibles durante {days} días; un enlace caducado ofrece enviar uno nuevo):",
  "email.completion.linksNote":
    "Los enlaces de descarga están disponibles durante {days} días. Un enlace caducado ofrece enviar uno nuevo.",
  "email.completion.ready":
    "El documento completado y su certificado están listos.",
  "email.completion.subject": "«{title}» está completamente firmado",
  "email.cta": "Revise y firme el documento",
  "email.deadlineLine": "Esta solicitud vence el {date}.",
  "email.downloadCertificate": "Descargar el certificado",
  "email.downloadRedactedCertificate": "Descargar el certificado redactado",
  "email.downloadSigned": "Descargar el PDF firmado",
  "email.footer.contact": "Contacto",
  "email.footer.privacyNotice": "Aviso de privacidad",
  "email.footer.privacyPolicy": "Política de privacidad",
  "email.footer.questions": "¿Preguntas? Escriba a {address}.",
  "email.footer.sentByOrg": "Enviado por {organization} con {product}.",
  "email.footer.sentByProduct": "Enviado con {product}.",
  "email.footer.terms": "Términos del servicio",
  "email.greeting": "Hola {name}:",
  "email.invitation.sent": "{sender} le envió «{title}» a través de {product}.",
  "email.invitation.subject": "{sender} le pide su firma en «{title}»",
  "email.newestLink":
    "Si recibe un enlace de invitación o recordatorio más nuevo, use el más nuevo.",
  "email.noAccount": "No necesita una cuenta de {product} para firmar.",
  "email.reminder.auto.intro":
    "{sender} sigue esperando su firma en «{title}», enviado a través de {product}.",
  "email.reminder.auto.subject":
    "Recordatorio: {sender} espera su firma en «{title}»",
  "email.reminder.manual.intro":
    "{sender} le envió un recordatorio para firmar «{title}» a través de {product}.",
  "email.reminder.manual.subject":
    "{sender} le envió un recordatorio para firmar «{title}»",
  "email.renewal.keep":
    "Descargue y conserve los archivos: son su copia del registro.",
  "email.renewal.line":
    "Aquí tiene nuevos enlaces de descarga para «{title}» en {product}. Funcionan durante {days} días.",
  "email.renewal.subject": "Nuevos enlaces de descarga para «{title}»",
  "email.text.certificateLabel": "Certificado",
  "email.text.redactedCertificateLabel": "Certificado redactado",
  "email.text.signedPdfLabel": "PDF firmado",
  "email.voided.body": "{sender} anuló «{title}» en {product}.",
  "email.voided.note":
    "El proceso de firma fue cancelado. No necesita hacer nada más.",
  "email.voided.subject": "«{title}» fue anulado por {sender}",
  "finishDialog.advanced":
    "Este documento pide una firma electrónica avanzada, hecha con un certificado a su nombre.",
  "finishDialog.back": "Volver",
  "finishDialog.confirmMeaning":
    "Confirmo este significado. Mi nombre, la fecha y la hora, y este significado se imprimirán junto a mi firma.",
  "finishDialog.confirmMeaningAria": "Confirmo el significado de mi firma",
  "finishDialog.continueToProvider": "Continuar con {provider}",
  "finishDialog.description": "Está firmando «{title}» de {sender}.",
  "finishDialog.emailAddress": "Correo electrónico",
  "finishDialog.enterCredentials":
    "Escriba el correo y la contraseña de su cuenta para firmar.",
  "finishDialog.finishing": "Terminando...",
  "finishDialog.finishSigning": "Terminar de firmar",
  "finishDialog.meaningOfSignature": "Significado de su firma",
  "finishDialog.password": "Contraseña",
  "finishDialog.plainConfirm":
    "Al pulsar Terminar, confirma que su firma electrónica tiene la intención de ser vinculante para este documento.",
  "finishDialog.preparing": "Preparando...",
  "finishDialog.providerSteps":
    "A continuación, {provider} le pedirá confirmar quién es y aprobar la firma. Cuando termine, volverá aquí. Al continuar, confirma que su firma tiene la intención de ser vinculante para este documento.",
  "finishDialog.qualified":
    "Este documento pide una firma electrónica cualificada, hecha con un certificado a su nombre.",
  "finishDialog.title": "¿Terminar de firmar?",
  "footer.eSignatures": "Firmas electrónicas",
  "footer.eSignaturesLong": "Para qué sirve",
  "footer.poweredBy": "Con la tecnología de {name}",
  "footer.privacy": "Privacidad",
  "footer.privacyLong": "Política de privacidad",
  "footer.privacyNotice": "Aviso de privacidad",
  "footer.terms": "Términos",
  "footer.termsLong": "Términos del servicio",
  "live.allComplete": "Todos los campos obligatorios están completos",
  "live.assignedFields": "Campos asignados",
  "live.canvasClearedMany": "Lienzo borrado {count} veces",
  "live.canvasClearedOne": "Lienzo borrado una vez",
  "live.checked": "Marcada",
  "live.chooseOne": "Elija una opción",
  "live.currentSigner": "Firmante actual",
  "live.currentSignerView": "Vista del firmante actual",
  "live.defaultDeclineError":
    "No pudimos registrar su rechazo en este momento. Vuelva a cargar la página o pida al remitente un nuevo enlace de firma.",
  "live.defaultSubmitError":
    "No pudimos completar la firma en este momento. Vuelva a cargar la página o pida al remitente un nuevo enlace de firma.",
  "live.decline": "Rechazar",
  "live.declineConfirm.description":
    "Su rechazo ha quedado registrado. No necesita hacer nada más, y este enlace ya no abre el documento.",
  "live.declineConfirm.title": "Ha rechazado firmar",
  "live.documentPage": "Página del documento",
  "live.downloadPdf": "Descargar PDF",
  "live.enterANumber": "Escriba un número",
  "live.enterText": "Escriba un texto",
  "live.fieldOnPage": "{label} · Página {page}",
  "live.finish": "Terminar",
  "live.fromSender": "De {sender}",
  "live.lockedFieldsNote":
    "Los valores de los firmantes anteriores permanecen visibles pero bloqueados. Solo sus campos asignados son editables.",
  "live.lockedValues": "Valores bloqueados visibles",
  "live.manyRemaining": "{count} campos obligatorios pendientes",
  "live.noAnswer": "Sin respuesta",
  "live.noFieldsBody":
    "Pase por las páginas para revisar sus campos asignados y los valores completados por firmantes anteriores.",
  "live.noFieldsTitle": "No hay campos de firmante en esta página",
  "live.notANumber": "No es un número",
  "live.numberWarning":
    "Un campo de número marcado en rojo no contiene un número. {message}",
  "live.oneRemaining": "{count} campo obligatorio pendiente",
  "live.optional": "Opcional",
  "live.pageOf": "Página {page} de {count}",
  "live.previousPage": "Página anterior",
  "live.nextPage": "Página siguiente",
  "live.readyToFinish": "Listo para terminar",
  "live.tapToSign": "Toque para firmar",
  "live.toolbar.manyRemaining": "{count} pendientes",
  "live.unchecked": "Sin marcar",
  "meaning.approval.label": "Aprobación",
  "meaning.approval.statement": "Apruebo este documento.",
  "meaning.authorship.label": "Autoría",
  "meaning.authorship.statement": "Soy el autor de este documento.",
  "meaning.responsibility.label": "Responsabilidad",
  "meaning.responsibility.statement":
    "Asumo la responsabilidad de este documento.",
  "meaning.review.label": "Revisión",
  "meaning.review.statement": "He revisado este documento.",
  "modal.addInitials": "Añada sus iniciales",
  "modal.addSignature": "Añada su firma",
  "modal.applyInitials": "Aplicar iniciales",
  "modal.applySignature": "Aplicar firma",
  "modal.canvasAria": "Lienzo para dibujar la firma",
  "modal.cancel": "Cancelar",
  "modal.clear": "Borrar",
  "modal.completedAlt": "{signer} completó {fieldType}",
  "modal.description":
    "Al firmar, acepta que esta firma electrónica es el equivalente legal de su firma manuscrita.",
  "modal.drawnInitials": "Iniciales dibujadas",
  "modal.drawnSignature": "Firma dibujada",
  "modal.drawPrompt": "Dibuje con el ratón o con el dedo",
  "modal.drawTab": "Dibujar",
  "modal.initialsPreviewAlt": "Vista previa de las iniciales",
  "modal.rendered": "Con estilo de firma",
  "modal.signaturePreviewAlt": "Vista previa de la firma",
  "modal.typeInitials": "Escribir iniciales",
  "modal.typeInitialsPlaceholder": "Escriba sus iniciales",
  "modal.typeSignature": "Escribir firma",
  "modal.typeSignaturePlaceholder": "Escriba su firma",
  "modal.typeTab": "Escribir",
  "pills.complete": "Completo",
  "pills.fixThis": "Corrija esto",
  "pills.required": "Obligatorio",
  "privacy.basis.body":
    "Para permitirle revisar y firmar el documento, entregar copias y conservar evidencia de quién firmó qué y cuándo. La base legal es la ejecución de un contrato del que usted forma parte (artículo 6(1)(b) del RGPD), el interés legítimo de la organización en poder demostrar el acuerdo (artículo 6(1)(f)) y cualquier obligación legal de conservar registros (artículo 6(1)(c)).",
  "privacy.basis.heading": "Con qué fin y sobre qué base",
  "privacy.collected.emails":
    "Registros de los correos que se le enviaron sobre el documento.",
  "privacy.collected.entries":
    "Lo que usted introduce: su firma o iniciales (escritas o dibujadas), fechas, textos y casillas, o su motivo para rechazar.",
  "privacy.collected.evidence":
    "Evidencia de la firma: cuándo abrió, aceptó y firmó, su dirección IP, la descripción que da su navegador de sí mismo y las comprobaciones que superó (como un código enviado por correo).",
  "privacy.collected.heading": "Qué se recopila",
  "privacy.collected.name":
    "Su nombre y dirección de correo, indicados por el remitente.",
  "privacy.description":
    "Cómo se usa su información cuando firma un documento aquí.",
  "privacy.fallbackOrganization": "La organización que administra este sitio",
  "privacy.intro":
    "{organization} usa este sitio para enviar documentos para firma electrónica. Este aviso indica qué se recopila sobre usted cuando firma, con qué fin y qué puede hacer al respecto.",
  "privacy.recipients.body":
    "Las demás partes del documento ven su nombre, correo y firma. Los servicios que operan este sitio los tratan para {organization}: el proveedor de alojamiento (Vercel), el proveedor de base de datos (por ejemplo Neon), el almacenamiento de archivos (Vercel Blob) y el proveedor de correo (Resend). Algunos están en Estados Unidos; cuando la información sale del Espacio Económico Europeo, queda protegida por el Marco de Privacidad de Datos UE-EE. UU. o por cláusulas contractuales tipo.",
  "privacy.recipients.heading": "Quién más la trata",
  "privacy.responsible.body":
    "{organization} es responsable de su información (el «responsable del tratamiento»).",
  "privacy.responsible.contactLead": "Puede contactarlos en",
  "privacy.responsible.contactTail": ".",
  "privacy.responsible.heading": "Quién es responsable",
  "privacy.responsible.noContact":
    "Póngase en contacto a través de la persona que le envió el documento.",
  "privacy.retention.days":
    "Los documentos terminados y sus registros de auditoría se eliminan {days} días después de terminar.",
  "privacy.retention.drafts":
    "Los borradores no enviados se eliminan tras {days} días sin cambios.",
  "privacy.retention.heading": "Cuánto tiempo se conserva",
  "privacy.retention.untilDeleted":
    "Los documentos terminados y sus registros de auditoría se conservan hasta que la organización los elimine, porque son evidencia de un acuerdo y muchos deben conservarse durante años por ley.",
  "privacy.rights.body":
    "Puede pedir a {organization} una copia de su información, corregirla, limitar u oponerse a su uso, o solicitar su eliminación. Un registro firmado puede conservarse pese a una solicitud de eliminación mientras sea necesario como evidencia o por ley (artículo 17(3) del RGPD). También puede reclamar ante la autoridad de protección de datos del lugar donde vive o trabaja.",
  "privacy.rights.heading": "Sus derechos",
  "privacy.title": "Aviso de privacidad para firmantes",
  "providerProblem.cancelled":
    "No terminó de firmar en {provider}. No se firmó nada, así que puede intentarlo de nuevo.",
  "providerProblem.expired":
    "Su sesión de firma anterior terminó antes de completarse. No se firmó nada, así que puede intentarlo de nuevo.",
  "providerProblem.failed":
    "{provider} no pudo completar su firma. No se firmó nada. Inténtelo de nuevo o pida ayuda al remitente.",
  "providerProblem.name":
    "El certificado con el que firmó en {provider} no está a nombre de la persona a la que se envió este documento. No se firmó nada. Si el nombre no es correcto, pida al remitente que envíe el documento de nuevo con el nombre que figura en su certificado.",
  "state.alreadySigned.description":
    "Ya completó su firma para este documento.",
  "state.alreadySigned.title": "Ya ha firmado",
  "state.declined.description":
    "Un firmante rechazó este documento. No necesita hacer nada más.",
  "state.declined.title": "Este sobre fue rechazado",
  "state.error.description":
    "No pudimos cargar este documento en este momento. Vuelva a cargar la página o pida al remitente un nuevo enlace de firma.",
  "state.error.title": "Algo salió mal. Inténtelo de nuevo.",
  "state.expired.description": "Pida al remitente un nuevo enlace de firma.",
  "state.expired.title": "Este enlace ha caducado",
  "state.voided.description":
    "El remitente canceló este documento. No necesita hacer nada más.",
  "state.voided.title": "Este sobre fue anulado",
  "verify.accessCodeHelper":
    "El remitente le dio este código por otro medio, por ejemplo por teléfono.",
  "verify.accessCodeLabel": "Código de acceso",
  "verify.accountHelper":
    "Este documento se firma con su propia cuenta aquí. Escriba la contraseña con la que inicia sesión.",
  "verify.accountLabel": "Contraseña",
  "verify.checkError": "No se pudo comprobar el código en este momento.",
  "verify.codeSent": "Se envió un código a {email}.",
  "verify.continue": "Continuar",
  "verify.emailAddress": "Correo electrónico",
  "verify.emailCodeHelper":
    "Enviamos por correo un código de 6 dígitos a la dirección a la que se envió este documento.",
  "verify.emailCodeLabel": "Código de su correo",
  "verify.emailHelper":
    "La dirección a la que se envió este documento ({email}).",
  "verify.emailMeCode": "Enviarme un código por correo",
  "verify.intro":
    "{sender} pidió una comprobación antes de que abra «{title}».",
  "verify.sendError": "No se pudo enviar el código en este momento.",
  "verify.sendNewCode": "Enviar un código nuevo",
  "verify.step": "Paso {step} de {total}.",
  "verify.title": "Confirme que es usted",
};

const dictionaries: Record<SignerLocale, Record<SignerMessageKey, string>> = {
  en,
  es,
};

/**
 * A signer-facing message in the given language, with {name} placeholders
 * filled in. A placeholder left out of the params stays in the text, which
 * the dictionary test catches for the keys that are checked there.
 */
export function t(
  locale: SignerLocale,
  key: SignerMessageKey,
  params?: Record<string, string | number>,
): string {
  const template = dictionaries[locale][key];

  if (!params) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (placeholder, name: string) =>
    name in params ? String(params[name]) : placeholder,
  );
}
