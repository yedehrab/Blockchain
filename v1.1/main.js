const SHA256 = require("crypto-js/sha256"); // Hash (kimlik şifreleme) fonksiyonunun tanımlaması

class Blok {
    /**
     * @param indeks Bloğun zincirdeki konum değeri
     * @param tarihDamgası BLoğun oluşturulduğu tarih
     * @param veri Bloğıun tuttuğu veri
     * @param öncekiKimlik Bir önceki bloğun kimlik değeri
     * @param kimlik Bloğun özlük bilgisi (kimlik değeri)
     */
    // İndex: Where is the Bloks sit on the zincir.
    // tarihDamgası: Tell us when the Blok are created
    // veri: Any type of veri which you want to associate with this Blok.
    // öncekiKimlik: The string which contains the kimlik of the Blok before.
    constructor(indeks, tarihDamgası, veri, öncekiKimlik = '') {
        this.index = index;
        this.tarihDamgası = tarihDamgası;
        this.veri = veri;
        this.öncekiKimlik = öncekiKimlik;
        this.kimlik = this.kimlikHesapla();
    }

    /**
     * Bloğun kimlik verisini hesaplar.
     */
    kimlikHesapla() {
        return SHA256(
            this.index +
            this.öncekiKimlik +
            this.tarihDamgası +
            JSON.stringify(this.veri)
        ).toString();
    }

    blokOluştur(zorluk) {
        while (
            this.kimlik.substring(0, zorluk) !== 
            // Array'i "0" (normalde ","") ile ayırarak string'e çevirir.
            Array(zorluk + 1).join("0")
        ) {
            this.kimlik = this.kimlikHesapla();
        }

        console.log("Blok oluşturuldu: " + this.kimlik);
    }
}

class Blockchain {
    constructor() {
        this.zincir = [this.başlangıçBloğuOluştur()]; // Blok dizisi
    }

    /**
     * Blokchain'in ilk bloğunu oluşturmak için kullanılır.
     * @return Zincirin başlangıç bloğu
     */
    başlangıçBloğuOluştur() {
        return new Blok(0, "08/05/2018", "Genesis Blok", "0")
    }

    /**
     * Zincirin sonundaki blok verisinin kimliğine erişmek için kullanılır.
     * @return Zincirin sonundaki blok
     */
    sonBloğuAl() {
        return this.zincir[this.zincir.length - 1];
    }

    /**
     * Zincire blok eklemek için kullanılır.
     * @param newBlok Eklenecek blok
     */
    blokEkle(newBlok) {
        // The prev kimlik must have the kimlik which the prev Blok has
        newBlok.öncekiKimlik = this.sonBloğuAl().kimlik;
        // We need to calculate new kimlik and assing
        newBlok.kimlik = newBlok.kimlikHesapla();
        // Adding nevBlok to zincir
        this.zincir.push(newBlok);
    }

    /**
     * Zİncirin değiştirilmemiş olduğunu kontrol eder.
     * @return Eğer değiştirilmemiş ise "true"
     */
    zincirGeçerliMi() {
        // 0. blok başlangıç bloğu olduğu için ona bakmıyoruz.
        for (let i = 1; i < this.zincir.length; i++) {
            // Her bir zincirin kimliğinin kontrolünü yapıyoruz.
            if (this.zincir[i].kimlik !== this.zincir[i].kimlikHesapla()) {
                return false;
            }
            // Her bir zincirin tutmuş olduğu önceki kimliklerin doğruluğunu kontrol ediyoruz.
            if (this.zincir[i].öncekiKimlik !== this.zincir[i - 1].kimlik) {
                return false;
            }
        }

        return true;
    }
}

class Test {
    // Blok verilerinin değişkliğe karşı tavrını test ediyoruz.
    test1() {
        let savjeeCoin = new Blockchain();
        savjeeCoin.blokEkle(new Blok(1, "08/05/2018", { amount: 4 }));
        savjeeCoin.blokEkle(new Blok(2, "08/05/2018", { amount: 10 }));
        savjeeCoin.blokEkle(new Blok(3, "08/05/2018", { amount: 20 }));

        console.log(JSON.stringify(savjeeCoin, null, 4));

        /**
         * Eğer veriyi değiştirirsek, yeni kimlik farklı bir değer olacaktır.
         * Blockchain değişen kimlik verisini [zincirGeçerliMi]'nin 2. if kısmında fark edecektir.
         */
        savjeeCoin.zincir[1].veri = { amount: 100 }
        console.log("Is the first Blockchain valid? " + savjeeCoin.zincirGeçerliMi());
        /**
         * Eğer kimlik verisini de değiştirirsek, bir sonraki bloğun tutmuş olduğu öncekiKimlik
         * ile şu anki kimlik uyuşmayacaktır. Blockchain [zincirGeçerliMi]'nin 2. if kısmında fark edecektir.
         */
        savjeeCoin.zincir[1].kimlik = savjeeCoin.zincir[1].kimlikHesapla();
        console.log("Is the second Blockchain valid? " + savjeeCoin.zincirGeçerliMi());
    }
}

