/*
    SCRIPT WEB E-WALLET SEDERHANA, with vanilla javascript ekekw
    Github @AgungSukaAFK
*/

// Bagian user balance
const tableUB = document.querySelector("#table-user-balance");

let users = [
    {userId: 1, username: "Agung", saldo: 0},
    {userId: 2, username: "Anip", saldo: 0},
    {userId: 3, username: "Aji", saldo: 0},
]

function updateUB(){
    clearPrevRow(tableUB);

    users.forEach((item) => {
        const row = tableUB.insertRow();
        const userId = row.insertCell(0);
        const username = row.insertCell(1);
        const saldo = row.insertCell(2);
    
        userId.innerHTML = item.userId;
        username.innerHTML = item.username;
        saldo.innerHTML = `Rp. ${(item.saldo).toLocaleString("id-ID")}`;
    })
}
// END

// Bagian riwayat topup user
let tableTH = document.querySelector("#table-topup-history");

let topupHist = [
    {trxId: 0, userId: 1, nominal: 50000},
    {trxId: 1, userId: 3, nominal: 50000},
    {trxId: 2, userId: 2, nominal: 150000},
    {trxId: 3, userId: 3, nominal: 30000},
]

function updateTH(){
    clearPrevRow(tableTH);

    topupHist.forEach((item, index) => {
        const row = tableTH.insertRow();
        const trxId = row.insertCell(0);
        const userId = row.insertCell(1);
        const username = row.insertCell(2);
        const nominal = row.insertCell(3);
    
        trxId.innerHTML = topupHist[index].trxId;
        userId.innerHTML = topupHist[index].userId;
        let result = users.find(obj => obj.userId === item.userId);
        username.innerHTML = result.username;
        nominal.innerHTML = `Rp. ${(item.nominal).toLocaleString("id-ID")}`;
    })
}

function tambahTopupHist(object){
    let checkId = topupHist.find(obj => obj.trxId === object.trxId)
    if(checkId){
        alert("TrxId untuk topup ini sudah ada.")
    } else {
        topupHist.push(object);
        topup(object);
    }
}
// END

// Bagian riwayat transfer
let tableTF = document.querySelector("#table-transfer-history");

let transferHist = [
    {trxId: 0, fromUserId: 2, toUserId: 1, nominal: 15000}
]

function updateTF(){
    clearPrevRow(tableTF);

    transferHist.forEach(item => {
        const row = tableTF.insertRow();
        const trxId = row.insertCell(0);
        const from = row.insertCell(1);
        const to = row.insertCell(2);
        const nominal = row.insertCell(3);
    
        trxId.innerHTML = item.trxId;
        from.innerHTML = item.fromUserId;
        to.innerHTML = item.toUserId;
        nominal.innerHTML = `Rp. ${(item.nominal).toLocaleString("id-ID")}`;
    })
}

function tambahTransferHist(object){
    let checkId = transferHist.find(obj => obj.trxId == object.trxId)
    if(checkId){
        alert("TrxId untuk transfer ini sudah ada.")
    } else {
        transferHist.push(object);
        transfer(object);
    }
}
// END

// UTILITIES
function updateUsersSaldo(){
    // Hitung saldo dari riwayat topup
    topupHist.forEach((item, index) => {
        let currentUser = users.find(obj => obj.userId == item.userId);
        currentUser.saldo += item.nominal;
    })
    // END

    // Hitung saldo dari riwayat transfer
    transferHist.forEach(item => {
        let from = users.find(obj => obj.userId == item.fromUserId);
        let to = users.find(obj => obj.userId == item.toUserId);
        let nom = item.nominal;
        from.saldo -= nom;
        to.saldo += nom;
    })
    // END
    updateAll();
}

function topup({userId, nominal}){
    let currentUser = users.find(obj => obj.userId == userId);
    currentUser.saldo += nominal;

    updateAll();
}

function transfer({fromUserId, toUserId, nominal}){
    let fromUser = users.find(obj => obj.userId == fromUserId);
    let toUser = users.find(obj => obj.userId == toUserId);
    fromUser.saldo -= nominal;
    toUser.saldo += nominal;

    updateAll();
}

function updateAll(){
    updateUB();
    updateTH();
    updateTF();
}

function clearPrevRow(element){
    let prevRow = element.getElementsByTagName("tr");
    
    if(prevRow.length){
        while(prevRow.length > 1){
            element.deleteRow(1);
        }
    }
}
// END

// function handlers
function topupFormHandler(e){
    e.preventDefault();
    let pilihanUser = document.querySelector("[name='pilih_user']").value;
    let pilihanNominal = document.querySelector("[name='pilih_nominal_tp']").value;
    if(isNaN(pilihanNominal) || isNaN(pilihanUser)){
        alert("Nominal atau UserId harus terdiri dari angka bilangan bulat!");
    } else if(!pilihanUser || !pilihanNominal){
        alert("Kolom UserId dan nominal topup harus terisi!");
    } else {
        let findUser = users.find(obj => obj.userId == pilihanUser);

        if(findUser){
            let newTp = {
                trxId: parseInt(topupHist.length),
                userId: parseInt(pilihanUser),
                nominal: parseInt(pilihanNominal)
            }
            tambahTopupHist(newTp);
            alert(`Topup sukses! Pengguna ${findUser.username} berhasil menambahkan saldo sebesar Rp. ${pilihanNominal.toLocaleString("id-ID")}`);
        } else {
            alert(`:/ Tidak ditemukan akun dengan UserId: ${pilihanUser}`);
        }

    }

    return false;
}

function transferFormHandler(e){
    e.preventDefault();

    let from = document.querySelector("[name='pilih_pengirim']").value;
    let to = document.querySelector("[name='pilih_penerima']").value;
    let nominal = document.querySelector("[name='pilih_nominal_tf']").value;

    if(!from || !to || !nominal){
        alert("Semua kolom harus terisi dengan benar!");
    } else if(isNaN(nominal) || isNaN(from) || isNaN(to)){
        alert("UserId dan nominal transfer harus berupa angka bilangan bulat");
    } else {
        let userFromTransfer = users.find(obj => obj.userId == from)
        let userToTransfer = users.find(obj => obj.userId == to);

        if(userFromTransfer && userToTransfer){
            let newTf = {
                trxId: parseInt(transferHist.length),
                fromUserId: parseInt(from),
                toUserId: parseInt(to),
                nominal: parseInt(nominal)
            }
            tambahTransferHist(newTf)
            alert(`Transfer berhasil! Pengguna ${userFromTransfer.username} berhasil kirim saldo sebesar Rp. ${nominal.toLocaleString("id-ID")} Kepada ${userToTransfer.username}`);
        } else if(!userFromTransfer){
            alert(`:/ Tidak ditemukan akun pengirim dengan userId: ${from}`)
        } else {
            alert(`:/ Tidak ditemukan akun penerima dengan userId: ${from}`)
        }
    }

    return false;
}
// END

// Post processing ... 
updateAll();
updateUsersSaldo();
