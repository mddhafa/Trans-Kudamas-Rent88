const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const DEFAULT_CONTACT = {
  phone: '+6289514693178',
  whatsappNumber: '6289514693178',
  email: 'info@agilrent.com',
};

function normalizeContact(contact) {
  const phone = contact?.phone || DEFAULT_CONTACT.phone;
  const whatsappNumber = (contact?.whatsappNumber || phone).replace(/\D/g, '');

  return {
    phone,
    whatsappNumber,
    email: contact?.email || DEFAULT_CONTACT.email,
  };
}

async function readContactSetting() {
  const setting = await prisma.contactSetting.findFirst({
    orderBy: { id: 'asc' },
  });

  return setting ? normalizeContact(setting) : DEFAULT_CONTACT;
}

exports.getContactSetting = async (_req, res) => {
  try {
    const data = await readContactSetting();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error get contact setting:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
};

exports.upsertContactSetting = async (req, res) => {
  try {
    const phone = (req.body.phone || DEFAULT_CONTACT.phone).trim();
    const whatsappNumber = ((req.body.whatsappNumber || phone) || '').replace(/\D/g, '');
    const email = (req.body.email || DEFAULT_CONTACT.email || '').trim();

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Nomor telepon harus diisi',
      });
    }

    const existing = await prisma.contactSetting.findFirst({
      orderBy: { id: 'asc' },
    });

    const data = {
      phone,
      whatsappNumber,
      email,
    };

    const saved = existing
      ? await prisma.contactSetting.update({
          where: { id: existing.id },
          data,
        })
      : await prisma.contactSetting.create({
          data,
        });

    return res.status(200).json({
      success: true,
      message: 'Pengaturan kontak berhasil disimpan',
      data: normalizeContact(saved),
    });
  } catch (error) {
    console.error('Error upsert contact setting:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
};