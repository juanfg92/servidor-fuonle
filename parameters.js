module.exports = {
    expReg: {
        categoryName: /^[A-Za-zÁÉÍÓÚáéíóúñÑü][A-Za-zÁÉÍÓÚáéíóú0-9 \-\x41\x42ñÑü.]{2,128}$/,
        classroomName: /^[A-Za-zÁÉÍÓÚáéíóúñÑü][A-Za-zÁÉÍÓÚáéíóú0-9 \-\x41\x42ñÑü.\º\ª]{2,128}$/,
        docTypeName: /^[A-Za-zÁÉÍÓÚáéíóúñÑü][A-Za-zÁÉÍÓÚáéíóú0-9 \-\x41\x42ñÑü]{2,64}$/,
        docPrivateName: /^[A-Za-zÁÉÍÓÚáéíóúñÑü][A-Za-zÁÉÍÓÚáéíóú0-9 /*+,.\-_!"'^`{}<>ºª%&()ñÑü]{2,128}$/,
        docPublicName: /^[A-Za-zÁÉÍÓÚáéíóúñÑü][A-Za-zÁÉÍÓÚáéíóú0-9 /*+,.\-_!"'^`{}<>ºª%&()ñÑü]{2,128}$/,
        docPublicDescription: /^[A-Za-zÁÉÍÓÚáéíóúñÑü][A-Za-zÁÉÍÓÚáéíóú0-9 /*-+,.-_!"'^`{}<>ºª%&()ñÑü]{2,512}$/,
        rolName: /^[A-Za-zÁÉÍÓÚáéíóúñÑ][A-Za-zÁÉÍÓÚáéíóú0-9 ,ñÑü]{2,64}$/,
        rolDescription: /^[A-Za-zÁÉÍÓÚáéíóúñÑ][A-Za-zÁÉÍÓÚáéíóú0-9 ,ñÑü]{2,256}$/,
        sectionName: /^[A-Za-zÁÉÍÓÚáéíóúñÑ][A-Za-zÁÉÍÓÚáéíóú0-9 \-\x41\x42ñÑü.\º\ª]{2,128}$/,
        studyLevelName: /^[A-Za-zÁÉÍÓÚáéíóúñÑü][A-Za-zÁÉÍÓÚáéíóú0-9 \-\x41\x42ñÑü.]{2,128}$/,
        subcategoryName: /^[A-Za-zÁÉÍÓÚáéíóúñÑü][A-Za-zÁÉÍÓÚáéíóú0-9 \-\x41\x42ñÑü.]{2,128}$/,
        suggestionTittle: /^[A-Za-zÁÉÍÓÚáéíóúñÑü][A-Za-zÁÉÍÓÚáéíóú0-9 \-\x41\x42ñÑü.]{2,128}$/,
        userEmail: /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
        userName: /^[A-Za-zÁÉÍÓÚáéíóúñÑ][A-Za-zÁÉÍÓÚáéíóú0-9ñÑü_-]{2,32}$/
    },
    errMessage: {
        categoryName: `the category name must be between 2 and 128 characters and start with a letter`,
        classroomName: `the class room name must be between 2 and 128 characters and start with a letter`,
        docTypeName: `the document type name must be between 2 and 64 characters, not contain points and empy start with a letter`,
        docPrivateName: `the document name must be between 2 and 128 characters and start with a letter`,
        docPublicName: `the document name must be between 2 and 128 characters and start with a letter`,
        docPublicDescription: `the description must be between 2 and 512 characters and start with a letter`,
        rolName: `the rol name must be between 2 and 64 characters and start with a letter`,
        rolDescription: `the rol description must be between 2 and 256 characters and start with a letter`,
        sectionName: `the section name must be between 2 and 128 characters and start with a letter`,
        studyLevelName: `the study level name must be between 2 and 128 characters and start with a letter`,
        subcategoryName: `the subcategory name must be between 2 and 128 characters and start with a letter`,
        suggestionTittle: `the suggestion tittle must be between 2 and 128 characters and start with a letter`,
        userEmail: `Email not valid`,
        userName: `the user name must be between 2 and 32 characters, not contain spaces and empy start with a letter`
    },
    mailer: {
        user: 'fuonle@gmail.com',
        password: 'fuonle1a2b3c'
    }
};