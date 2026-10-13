import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(process.cwd(), 'index.html'),
          hammurabi: path.resolve(process.cwd(), 'hammurabi.html'),
          prolog: path.resolve(process.cwd(), 'prolog.html'),
          hukum: path.resolve(process.cwd(), 'hukum.html'),
          hukumPeradilan: path.resolve(process.cwd(), 'hukum-peradilan.html'),
          hukumPencurian: path.resolve(process.cwd(), 'hukum-pencurian.html'),
          hukumBudakKabur: path.resolve(process.cwd(), 'hukum-budak-kabur.html'),
          hukumKejahatanProperti: path.resolve(process.cwd(), 'hukum-kejahatan-properti.html'),
          hukumMiliterPejabat: path.resolve(process.cwd(), 'hukum-militer-pejabat.html'),
          hukumAgraris: path.resolve(process.cwd(), 'hukum-agraris.html'),
          hukumBagianHilang: path.resolve(process.cwd(), 'hukum-bagian-hilang.html'),
          hukumPerdagangan: path.resolve(process.cwd(), 'hukum-perdagangan.html'),
          hukumKeluarga: path.resolve(process.cwd(), 'hukum-keluarga.html'),
          hukumPidana: path.resolve(process.cwd(), 'hukum-pidana.html'),
          hukumPelayaran: path.resolve(process.cwd(), 'hukum-pelayaran.html'),
          hukumSewaUpah: path.resolve(process.cwd(), 'hukum-sewa-upah.html'),
          hukumBudak: path.resolve(process.cwd(), 'hukum-budak.html'),
          pasalTerkenal: path.resolve(process.cwd(), 'pasal-terkenal.html'),
          epilog: path.resolve(process.cwd(), 'epilog.html'),
          perbandingan: path.resolve(process.cwd(), 'perbandingan.html'),
          tentang: path.resolve(process.cwd(), 'tentang.html'),
        },
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
