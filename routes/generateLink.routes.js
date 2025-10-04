import db from "../database/index.js";
import express from "express";
import { google } from "googleapis";

const oAuth2Client = new google.auth.OAuth2(
	"362384645885-6uthr6qcq6rtg403hqt1cfms80mcu4f2.apps.googleusercontent.com",
	"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",
	"http://localhost:3000/api/generate-link/oauth2callback"
);

const router = express.Router();
router.get("/auth", (req, res) => {
	const url = oAuth2Client.generateAuthUrl({
		access_type: "offline",
		scope: ["https://www.googleapis.com/auth/calendar.events"],
	});
	res.redirect(url);
});

router.post("/generate-meet-link/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const code = db.User.findAll({
			where: { email: process.env.ADMIN_EMAIL },
			attributes: ["hash_google_meet"],
		});
		oAuth2Client.setCredentials({
			refresh_token: (await code)[0].hash_google_meet,
		});
		const infoAppointment = await db.Appointment.findByPk(id);
		if (!infoAppointment) {
			return res
				.status(404)
				.json({ error: "Appointment not found" });
		}
		const year = new Date(infoAppointment.day).getFullYear();
		const month = new Date(infoAppointment.day).getMonth() + 1; // Los meses son 0-indexados
		const day = new Date(infoAppointment.day).getDate();
		const startTime = year+'-'+(month<10?'0'+month:month)+'-'+(day<10?'0'+day:day)+'T'+infoAppointment.start_time+"-00:00"
		const endTime = year+'-'+(month<10?'0'+month:month)+'-'+(day<10?'0'+day:day)+'T'+infoAppointment.end_time+"-00:00"
		const calendar = google.calendar({
			version: "v3",
			auth: oAuth2Client,
		});
		const event = await calendar.events.insert({
			calendarId: "primary",
			requestBody: {
				summary: "Reunión",
				start: { dateTime: startTime,
						timeZone: process.env.ZONE_TIME
				 },
				end: { dateTime: endTime,
					timeZone: process.env.ZONE_TIME
				},
				conferenceData: {
					createRequest: {
						requestId: `meet-${Date.now()}`,
					},
				},
			},
			conferenceDataVersion: 1,
		});
		res.status(200).json({
			status: "success",
			link: event.data.hangoutLink,
		});
	} catch (error) {
		  if (error.message && error.message.includes('invalid_grant')) {
			res.redirect('/api/generate-link/auth'

			);
		}else{
console.error("Error generating link:", error);
		res.status(500).json({
			error: "Error generating link",
			message: error.message,
		});

		}


	}
});
router.put("/save-meet-link/:id", async (req, res) => {
	const { id } = req.params;
	const { link } = req.body;
	try {
		const appointment = await db.Appointment.findByPk(id);
		if (!appointment) {
			return res
				.status(404)
				.json({ error: "Appointment not found" });
		}
		appointment.meeting_link = link;
		await appointment.save();
		res.status(200).json({
			status: "success",
			appointment,
			message: "Meeting link saved successfully",
		});
	} catch (error) {

		console.error("Error saving meeting link:", error);
		res.status(500).json({
			error: "Error saving meeting link",
			message: error.message,
		});
	}
});
router.get("/oauth2callback", async (req, res) => {
	const code = req.query.code; // <--- Aquí SI recibes el code
	try {
		const { tokens } = await oAuth2Client.getToken(code);
		oAuth2Client.setCredentials(tokens);
		db.User.update(
			{
				hash_google_meet: tokens.access_token,
			},
			{ where: { email: process.env.ADMIN_EMAIL } }
		)
		res.setHeader(
			"Content-Security-Policy",
			"script-src 'self' 'nonce-12345';"
		);
		res.send(`
      <html>
        <body>
          <script nonce="12345">

    if (window.opener) {
          window.opener.postMessage({ success: true }, "*");
        }
        setTimeout(() => window.close(), 2000);
</script>
          <p>Autenticación exitosa. Puedes cerrar esta ventana.</p>
        </body>
      </html>
    `);
	} catch (err) {
		console.error(err);
		res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage({ success: false, error: "${err.message}" }, "*");
            window.close();
          </script>
          <p>Error en la autenticación. Puedes cerrar esta ventana.</p>
        </body>
      </html>
    `);
	}
});

export default router;
