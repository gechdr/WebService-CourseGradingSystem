// intall express joi @joi/date sequelize mysql2 axios

const express = require("express");
const app = express();
app.set("port", 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Sequelize = require("sequelize");
const { Model, DataTypes, Op } = require("sequelize");
const conn = new Sequelize("", "root", "", {
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

// const Joi = require("joi").extend(require("@joi/date"));
// const axios = require("axios");

const jwt = require("jsonwebtoken");
const JWT_KEY = "TUGASWSM6";

const User = require("./models/User");
const Class = require("./models/Class");
const ClassEnrollment = require("./models/ClassEnrollment");
const Review = require("./models/Review");

// -------------------------------------------------------

// 1

async function generateUserID(role) {
	let tempID;
	if (role == 0) {
		tempID = "S";
	} else if (role == 1) {
		tempID = "T";
	}

	// Find Last ID
	let users = await User.findAll({
		where: {
			id_user: {
				[Op.like]: "%" + tempID + "%",
			},
		},
	});

	let lastID;
	if (users.length > 0) {
		users.forEach((user) => {
			let id_user = user.id_user;
			lastID = id_user.substring(1);
		});
	} else {
		lastID = "000";
	}
	lastID++;

	let newID = tempID + lastID.toString().padStart(3, "0");

	return newID;
}

app.post("/api/users", async (req, res) => {
	let { name, password, role } = req.body;

	// Empty
	if (!name || !password || !role) {
		return res.status(400).send("Semua field wajib diisi");
	}

	let strRole;
	if (/^\d+$/.test(role) == false) {
		return res.status(400).send("Invalid Role! [0,1]");
	}
	if (role == 0) {
		strRole = "Student";
	} else if (role == 1) {
		strRole = "Teacher";
	} else {
		return res.status(400).send("Invalid Role! [0,1]");
	}

	// Generate ID
	let newID = await generateUserID(role);

	// Insert
	try {
		user = await User.create({
			id_user: newID,
			name: name,
			password: password,
			role: role,
		});
	} catch (error) {
		return res.status(400).send({
			message: "Insert Failed",
			error,
		});
	}

	return res.status(201).send({
		id_user: newID,
		name: name,
		role: strRole,
	});
});

// 2

app.post("/api/login", async (req, res) => {
	let { id_user, password } = req.body;

	if (!id_user || !password) {
		return res.status(400).send("Semua field harus diisi");
	}

	let user = await User.findByPk(id_user);
	if (!user) {
		return res.status(404).send("User tidak ditemukan");
	}
	if (password != user.password) {
		return res.status(400).send("Password salah");
	}

	let token = jwt.sign(
		{
			id_user: id_user,
			role: user.role,
		},
		JWT_KEY
	);

	return res.status(201).send({
		id_user: id_user,
		token: token,
	});
});

// 3

function cekToken(req, res, next) {
	const token = req.headers["x-auth-token"];
	if (!token) {
		return res.status(401).send("Unauthorized");
	}

	try {
		const user = jwt.verify(token, JWT_KEY);
		req.user = user;
		next();
	} catch (error) {
		console.log(error);
		return res.status(400).send(error);
	}
}

async function generateClassID() {
	let tempID = "C";

	// Find Last ID
	let classes = await Class.findAll({
		where: {
			id_class: {
				[Op.like]: "%" + tempID + "%",
			},
		},
	});

	let lastID;
	if (classes.length > 0) {
		classes.forEach((item) => {
			let id_class = item.id_class;
			lastID = id_class.substring(1);
		});
	} else {
		lastID = "000";
	}
	lastID++;

	let newID = tempID + lastID.toString().padStart(3, "0");

	return newID;
}

app.post("/api/classes", cekToken, async (req, res) => {
	let { name, id_teacher } = req.body;
	let user = req.user;

	if (user.role != 2) {
		return res.status(401).send("Bukan Admin");
	}

	if (!name || !id_teacher) {
		return res.status(400).send("Semua field harus diisi");
	}

	let teacher = await User.findByPk(id_teacher);
	if (!teacher) {
		return res.status(404).send("Teacher tidak ditemukan");
	}
	let teacherName = teacher.name;

	// Generate ID
	let newID = await generateClassID();

	// Insert
	try {
		tempClass = await Class.create({
			id_class: newID,
			name: name,
			id_teacher: id_teacher,
		});
	} catch (error) {
		return res.status(400).send({
			message: "Insert Failed",
			error,
		});
	}

	return res.status(201).send({
		id_class: newID,
		name: name,
		teacher: teacherName,
	});
});

// 4

app.post("/api/users/classes", cekToken, async (req, res) => {
	let { id_class } = req.body;
	let user = req.user;

	if (user.role != 0) {
		return res.status(401).send("Bukan student");
	}

	if (!id_class) {
		return res.status(400).send("Semua field harus diisi");
	}

	let tempClass = await Class.findByPk(id_class);
	if (!tempClass) {
		return res.status(404).send("Class tidak ditemukan");
	}
	let className = tempClass.name;

	let classEnrollments = await ClassEnrollment.findAll({
		where: {
			[Op.and]: {
				id_class: id_class,
				id_student: user.id_user,
			},
		},
	});

	let joined = true;
	if (classEnrollments.length < 1) {
		joined = false;
	}

	if (joined) {
		return res.status(400).send("Sudah bergabung kedalam kelas");
	}

	// Insert
	try {
		classenrollment = await ClassEnrollment.create({
			id_class: id_class,
			id_student: user.id_user,
		});
	} catch (error) {
		return res.status(400).send({
			message: "Insert Failed",
			error,
		});
	}

	return res.status(201).send({
		message: `Berhasil bergabung ke kelas ${className}`,
	});
});

// 5

app.delete("/api/users/classes/:id_class", cekToken, async (req, res) => {
	let { id_class } = req.params;
	let user = req.user;

	if (user.role != 0) {
		return res.status(401).send("Bukan student");
	}

	if (!id_class) {
		return res.status(400).send("Semua field harus diisi");
	}

	let tempClass = await Class.findByPk(id_class);
	if (!tempClass) {
		return res.status(404).send("Class tidak ditemukan");
	}
	let className = tempClass.name;

	let classEnroll = await ClassEnrollment.findOne({
		where: {
			[Op.and]: {
				id_class: id_class,
				id_student: user.id_user,
			},
		},
	});
	if (!classEnroll) {
		return res.status(400).send("User tidak bergabung kedalam kelas");
	}

	// DELETE
	try {
		classEnrolls = await ClassEnrollment.destroy({
			where: {
				[Op.and]: {
					id_class: id_class,
					id_student: user.id_user,
				},
			},
		});
	} catch (error) {
		return res.status(400).send({
			message: "Delete Failed",
			error,
		});
	}

	return res.status(200).send({
		message: `Berhasil drop kelas ${className}`,
	});
});

// 6

app.post("/api/users/classes/:id_class/grades", cekToken, async (req, res) => {
	let { id_class } = req.params;
	let { id_student, HARIAN, UTS, UAS } = req.body;
	let user = req.user;

	if (user.role != 1) {
		return res.status(401).send("Bukan teacher");
	}

	if (!id_class || !id_student || !HARIAN || !UTS || !UAS) {
		return res.status(400).send("Semua field wajib diisi");
	}
	if (/^\d+$/.test(HARIAN) == false || HARIAN < 0 || HARIAN > 100) {
		return res.status(400).send("HARIAN Value allowed is an integer between 0-100.");
	}
	if (/^\d+$/.test(UTS) == false || UTS < 0 || UTS > 100) {
		return res.status(400).send("UTS Value allowed is an integer between 0-100.");
	}
	if (/^\d+$/.test(UAS) == false || UAS < 0 || UAS > 100) {
		return res.status(400).send("UAS Value allowed is an integer between 0-100.");
	}

	let student = await User.findByPk(id_student);
	if (!student) {
		return res.status(404).send("Student tidak ditemukan");
	}
	let studentName = student.name;

	let tempClass = await Class.findByPk(id_class);
	if (!tempClass) {
		return res.status(404).send("Class tidak ditemukan");
	}
	if (tempClass.id_teacher != user.id_user) {
		return res.status(400).send("Anda tidak mengajar Class ini");
	}

	// Insert
	try {
		classEnrolls = await ClassEnrollment.update(
			{
				harian: HARIAN,
				uts: UTS,
				uas: UAS,
			},
			{
				where: {
					[Op.and]: {
						id_class: id_class,
						id_student: id_student,
					},
				},
			}
		);
	} catch (error) {
		return res.status(400).send({
			message: "Insert Failed",
			error,
		});
	}

	return res.status(201).send({
		message: `Nilai dari ${studentName} berhasil diinputkan`,
	});
});

// 7

app.put("/api/users/classes/:id_class/grades/:id_student", cekToken, async (req, res) => {
	let { id_class, id_student } = req.params;
	let { HARIAN, UTS, UAS } = req.body;
	let user = req.user;

	if (user.role != 1) {
		return res.status(401).send("Bukan teacher");
	}

	if (!id_class || !id_student || !HARIAN || !UTS || !UAS) {
		return res.status(400).send("Semua field wajib diisi");
	}
	if (/^\d+$/.test(HARIAN) == false || HARIAN < 0 || HARIAN > 100) {
		return res.status(400).send("HARIAN Value allowed is an integer between 0-100.");
	}
	if (/^\d+$/.test(UTS) == false || UTS < 0 || UTS > 100) {
		return res.status(400).send("UTS Value allowed is an integer between 0-100.");
	}
	if (/^\d+$/.test(UAS) == false || UAS < 0 || UAS > 100) {
		return res.status(400).send("UAS Value allowed is an integer between 0-100.");
	}

	let tempClass = await Class.findByPk(id_class);
	if (!tempClass) {
		return res.status(404).send("Class tidak ditemukan");
	}
	if (tempClass.id_teacher != user.id_user) {
		return res.status(400).send("Anda tidak mengajar Class ini");
	}

	let student = await User.findByPk(id_student);
	if (!student) {
		return res.status(404).send("Student tidak ditemukan");
	}
	let studentName = student.name;

	let classEnroll = await ClassEnrollment.findOne({
		where: {
			[Op.and]: {
				id_class: id_class,
				id_student: id_student,
			},
		},
	});
	if (!classEnroll) {
		return res.status(400).send("Student tidak mengikuti Class ini");
	}
	if (classEnroll.harian == null || classEnroll.uts == null || classEnroll.uas == null) {
		return res.status(400).send("Nilai dari student belum pernah diinputkan");
	}

	// Update
	try {
		classEnrolls = await ClassEnrollment.update(
			{
				harian: HARIAN,
				uts: UTS,
				uas: UAS,
			},
			{
				where: {
					[Op.and]: {
						id_class: id_class,
						id_student: id_student,
					},
				},
			}
		);
	} catch (error) {
		return res.status(400).send({
			message: "Update Failed",
			error,
		});
	}

	return res.status(201).send({
		message: `Nilai dari ${studentName} berhasil diubah`,
	});
});

// 8

app.post("/api/users/classes/:id_class/reviews", cekToken, async (req, res) => {
	let { id_class } = req.params;
	let { rating, review } = req.body;
	let user = req.user;

	if (user.role != 0) {
		return res.status(401).send("Bukan student");
	}

	if (!id_class || !rating || !review) {
		return res.status(400).send("Semua field wajib diisi");
	}

	if (/^\d+$/.test(rating) == false || rating < 1 || rating > 5) {
		return res.status(400).send("Rating Value allowed is an integer between 1-5.");
	}

	let tempClass = await Class.findByPk(id_class);
	if (!tempClass) {
		return res.status(404).send("Class tidak ditemukan");
	}
	let className = tempClass.name;

	let classEnroll = await ClassEnrollment.findOne({
		where: {
			[Op.and]: {
				id_class: id_class,
				id_student: user.id_user,
			},
		},
	});
	if (!classEnroll) {
		return res.status(400).send("Student tidak mengikuti Class ini");
	}

	let tempReview = await Review.findOne({
		where: {
			id_class: id_class,
			id_student: user.id_user,
		},
	});
	if (tempReview) {
		try {
			reviews = await Review.update(
				{
					rating: rating,
					review: review,
				},
				{
					where: {
						[Op.and]: {
							id_class: id_class,
							id_student: user.id_user,
						},
					},
				}
			);
		} catch (error) {
			return res.status(400).send({
				message: "Update Failed",
				error,
			});
		}
	} else {
		// Insert
		try {
			reviews = await Review.create({
				id_class: id_class,
				id_student: user.id_user,
				rating: rating,
				review: review,
			});
		} catch (error) {
			return res.status(400).send({
				message: "Insert Failed",
				error,
			});
		}
	}

	return res.status(201).send({
		message: `Berhasil submit review untuk kelas ${className}`,
	});
});

// 9

app.get("/api/users/classes/:id_class/grades", cekToken, async (req, res) => {
	let { id_class } = req.params;
	let user = req.user;

	let tempClass = await Class.findByPk(id_class);
	if (!tempClass) {
		return res.status(404).send("Class tidak ditemukan");
	}
	let className = tempClass.name;

	if (user.role == 0) {
		// STUDENT

		let classEnroll = await ClassEnrollment.findOne({
			where: {
				[Op.and]: {
					id_class: id_class,
					id_student: user.id_user,
				},
			},
		});
		if (!classEnroll) {
			return res.status(400).send("Student tidak mengikuti Class ini");
		}

		if (classEnroll.harian == null || classEnroll.uts == null || classEnroll.uas == null) {
			return res.status(400).send("Nilai belum dipost");
		}

		let nilaiAkhir = (parseFloat(classEnroll.harian) + parseFloat(classEnroll.uts) + parseFloat(classEnroll.uas)) / 3;

		let grades = {
			HARIAN: classEnroll.harian,
			UTS: classEnroll.uts,
			UAS: classEnroll.uas,
			NILAI_AKHIR: nilaiAkhir,
		};

		let review = await Review.findOne({
			where: {
				[Op.and]: {
					id_class: id_class,
					id_student: user.id_user,
				},
			},
		});
		if (!review) {
			return res.status(400).send("Student belum memberikan review");
		}

		let teacher = await User.findByPk(tempClass.id_teacher);
		let teacherName = teacher.name;

		let student = await User.findByPk(user.id_user);
		let studentName = student.name;

		return res.status(200).send({
			nama_kelas: className,
			nama_teacher: teacherName,
			nama_student: studentName,
			grades: grades,
		});

		return res.status(200).send();
	} else if (user.role == 1) {
		// TEACHER

		let teacher = await User.findByPk(user.id_user);
		let teacherName = teacher.name;

		let classEnrolls = await ClassEnrollment.findAll({
			where: {
				id_class: id_class,
			},
		});
		if (classEnrolls.length < 1) {
			return res.status(400).send("Class tidak memiliki Student");
		}

		let students = [];

		for (let i = 0; i < classEnrolls.length; i++) {
			const enroll = classEnrolls[i];
			let id_student = enroll.id_student;
			let harian = enroll.harian;
			let uts = enroll.uts;
			let uas = enroll.uas;

			let nilaiAkhir = (parseFloat(harian) + parseFloat(uts) + parseFloat(uas)) / 3;

			let grades = {
				HARIAN: harian,
				UTS: uts,
				UAS: uas,
				NILAI_AKHIR: nilaiAkhir,
			};

			let student = await User.findByPk(id_student);
			let studentName = student.name;

			let reviews = await Review.findOne({
				where: {
					[Op.and]: {
						id_class: id_class,
						id_student: id_student,
					},
				},
			});

			let review;

			if (reviews) {
				review = {
					rating: reviews.rating,
					review: reviews.review,
				};
			} else {
				review = "-";
			}

			let data = {
				nama_student: studentName,
				grades: grades,
				review: review,
			};

			students.push(data);
		}

		return res.status(200).send({
			nama_kelas: className,
			nama_teacher: teacherName,
			students: students,
		});
	} else {
		return res.status(400).send("Admin !! :D");
	}
});

// -------------------------------------------------------

app.listen(app.get("port"), () => {
	console.log(`Server started at http://localhost:${app.get("port")}`);
});
