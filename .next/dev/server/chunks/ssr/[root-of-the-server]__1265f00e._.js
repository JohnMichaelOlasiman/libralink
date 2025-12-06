module.exports = [
"[project]/Downloads/libra-link-student-app (2)/lib/db.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient,
    "sql",
    ()=>sql,
    "withRetry",
    ()=>withRetry
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f40$neondatabase$2b$serverless$40$1$2e$0$2e$2$2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/node_modules/.pnpm/@neondatabase+serverless@1.0.2/node_modules/@neondatabase/serverless/index.mjs [app-rsc] (ecmascript)");
;
function createClient() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL environment variable is not set");
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f40$neondatabase$2b$serverless$40$1$2e$0$2e$2$2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["neon"])(connectionString);
}
async function withRetry(fn, retries = 3, baseDelay = 100) {
    let lastError = null;
    for(let attempt = 0; attempt < retries; attempt++){
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            console.error(`[v0] Database attempt ${attempt + 1}/${retries} failed:`, error);
            if (attempt < retries - 1) {
                const delay = baseDelay * Math.pow(2, attempt);
                await new Promise((resolve)=>setTimeout(resolve, delay));
            }
        }
    }
    throw lastError;
}
async function sql(strings, ...values) {
    return withRetry(async ()=>{
        const client = createClient();
        return await client(strings, ...values);
    });
}
sql.unsafe = async (query, values)=>{
    return withRetry(async ()=>{
        const client = createClient();
        const result = await client.query(query, values || []);
        return result;
    });
};
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/Downloads/libra-link-student-app (2)/lib/auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSession",
    ()=>getSession,
    "getUserById",
    ()=>getUserById,
    "isAdmin",
    ()=>isAdmin,
    "isLibrarian",
    ()=>isLibrarian,
    "isStaff",
    ()=>isStaff,
    "requireAuth",
    ()=>requireAuth,
    "requireRole",
    ()=>requireRole,
    "signIn",
    ()=>signIn,
    "signOut",
    ()=>signOut,
    "signUp",
    ()=>signUp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/node_modules/.pnpm/next@16.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
;
;
// Simple password hashing (in production, use bcrypt)
function hashPassword(password) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash("sha256").update(password).digest("hex");
}
function verifyPassword(password, hash) {
    return hashPassword(password) === hash;
}
// Generate a secure random token
function generateToken() {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(32).toString("hex");
}
// Session duration (7 days)
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;
async function signUp(email, password, fullName, universityId, universityName, idCardUrl) {
    try {
        // Check if email already exists
        const existingUser = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      SELECT id FROM users WHERE email = ${email}
    `;
        if (existingUser.length > 0) {
            return {
                user: null,
                error: "Email already registered"
            };
        }
        // Check if university ID already exists
        if (universityId) {
            const existingId = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
        SELECT id FROM users WHERE university_id = ${universityId}
      `;
            if (existingId.length > 0) {
                return {
                    user: null,
                    error: "University ID already registered"
                };
            }
        }
        const passwordHash = hashPassword(password);
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      INSERT INTO users (email, password_hash, full_name, university_id, university_name, id_card_url)
      VALUES (${email}, ${passwordHash}, ${fullName}, ${universityId || null}, ${universityName || null}, ${idCardUrl || null})
      RETURNING *
    `;
        return {
            user: result[0],
            error: null
        };
    } catch (error) {
        console.error("Sign up error:", error);
        return {
            user: null,
            error: "Failed to create account"
        };
    }
}
async function signIn(email, password) {
    try {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      SELECT * FROM users WHERE email = ${email}
    `;
        if (result.length === 0) {
            return {
                user: null,
                token: null,
                error: "Invalid email or password"
            };
        }
        const user = result[0];
        if (user.status !== "active") {
            return {
                user: null,
                token: null,
                error: "Account is not active"
            };
        }
        if (!verifyPassword(password, user.password_hash)) {
            return {
                user: null,
                token: null,
                error: "Invalid email or password"
            };
        }
        // Create session
        const token = generateToken();
        const expiresAt = new Date(Date.now() + SESSION_DURATION);
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      INSERT INTO sessions (user_id, token, expires_at)
      VALUES (${user.id}, ${token}, ${expiresAt})
    `;
        // Update last login
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      UPDATE users SET last_login = NOW() WHERE id = ${user.id}
    `;
        // Log the login
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      INSERT INTO system_logs (user_id, action, entity_type, entity_id, details)
      VALUES (${user.id}, 'user_login', 'user', ${user.id}, '{"method": "password"}')
    `;
        return {
            user,
            token,
            error: null
        };
    } catch (error) {
        console.error("Sign in error:", error);
        return {
            user: null,
            token: null,
            error: "Failed to sign in"
        };
    }
}
async function signOut(token) {
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      DELETE FROM sessions WHERE token = ${token}
    `;
    } catch (error) {
        console.error("Sign out error:", error);
    }
}
async function getSession() {
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
        const token = cookieStore.get("session_token")?.value;
        if (!token) {
            return {
                user: null,
                token: null
            };
        }
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      SELECT u.* FROM users u
      INNER JOIN sessions s ON u.id = s.user_id
      WHERE s.token = ${token} AND s.expires_at > NOW()
    `;
        if (result.length === 0) {
            return {
                user: null,
                token: null
            };
        }
        return {
            user: result[0],
            token
        };
    } catch (error) {
        console.error("Get session error:", error);
        return {
            user: null,
            token: null
        };
    }
}
async function getUserById(id) {
    try {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      SELECT * FROM users WHERE id = ${id}
    `;
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error("Get user error:", error);
        return null;
    }
}
async function requireAuth() {
    const { user } = await getSession();
    if (!user) {
        throw new Error("Unauthorized");
    }
    return user;
}
async function requireRole(roles) {
    const user = await requireAuth();
    if (!roles.includes(user.role)) {
        throw new Error("Forbidden");
    }
    return user;
}
function isAdmin(user) {
    return user.role === "admin";
}
function isLibrarian(user) {
    return user.role === "librarian" || user.role === "admin";
}
function isStaff(user) {
    return user.role === "librarian" || user.role === "admin";
}
}),
"[project]/Downloads/libra-link-student-app (2)/lib/actions/reservation-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"0003e72aa1bcba511bf4dbd2e5c21f143fca7490f5":"getReservationStats","403a925e5eee22eee7ecf7176965c650d4c8554c78":"getUserReservations","4059f65252b88b9655c26fd08a5cf8ca64eb23b2ff":"cancelReservation","4078a3f97f48e385babf077fab08135bfe72de7eec":"fulfillReservation","408e91126ad82588e341a6b22f37af06cf9e4cb2a2":"getReservations","40d1e1bef013e4032638d2a38e90df50c41ac4c2b4":"createReservation"},"",""] */ __turbopack_context__.s([
    "cancelReservation",
    ()=>cancelReservation,
    "createReservation",
    ()=>createReservation,
    "fulfillReservation",
    ()=>fulfillReservation,
    "getReservationStats",
    ()=>getReservationStats,
    "getReservations",
    ()=>getReservations,
    "getUserReservations",
    ()=>getUserReservations
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/node_modules/.pnpm/next@16.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/lib/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/node_modules/.pnpm/next@16.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function getReservations(status) {
    try {
        let query = `
      SELECT r.*, 
        jsonb_build_object('id', u.id, 'full_name', u.full_name, 'email', u.email, 'avatar_url', u.avatar_url) as user,
        jsonb_build_object('id', b.id, 'title', b.title, 'cover_url', b.cover_url, 'available_copies', b.available_copies) as book
      FROM reservations r
      INNER JOIN users u ON r.user_id = u.id
      INNER JOIN books b ON r.book_id = b.id
    `;
        if (status) {
            query += ` WHERE r.status = '${status}'`;
        }
        query += ` ORDER BY r.reserved_at DESC`;
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"].unsafe(query);
        return result;
    } catch (error) {
        console.error("Get reservations error:", error);
        return [];
    }
}
async function getUserReservations(userId) {
    try {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      SELECT r.*, 
        jsonb_build_object('id', u.id, 'full_name', u.full_name, 'email', u.email) as user,
        jsonb_build_object('id', b.id, 'title', b.title, 'cover_url', b.cover_url) as book
      FROM reservations r
      INNER JOIN users u ON r.user_id = u.id
      INNER JOIN books b ON r.book_id = b.id
      WHERE r.user_id = ${userId}
      ORDER BY r.reserved_at DESC
    `;
        return result;
    } catch (error) {
        console.error("Get user reservations error:", error);
        return [];
    }
}
async function createReservation(bookId) {
    try {
        const { user } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
        if (!user) {
            return {
                reservation: null,
                error: "Not authenticated"
            };
        }
        // Check for existing active reservation
        const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      SELECT id FROM reservations 
      WHERE user_id = ${user.id} AND book_id = ${bookId} AND status = 'active'
    `;
        if (existing.length > 0) {
            return {
                reservation: null,
                error: "You already have an active reservation for this book"
            };
        }
        // Set expiration date (7 days from now)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      INSERT INTO reservations (user_id, book_id, expires_at)
      VALUES (${user.id}, ${bookId}, ${expiresAt})
      RETURNING *
    `;
        return {
            reservation: result[0],
            error: null
        };
    } catch (error) {
        console.error("Create reservation error:", error);
        return {
            reservation: null,
            error: "Failed to create reservation"
        };
    }
}
async function fulfillReservation(reservationId) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])([
            "librarian",
            "admin"
        ]);
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      UPDATE reservations 
      SET status = 'fulfilled', fulfilled_at = NOW()
      WHERE id = ${reservationId}
    `;
        return {
            error: null
        };
    } catch (error) {
        console.error("Fulfill reservation error:", error);
        return {
            error: "Failed to fulfill reservation"
        };
    }
}
async function cancelReservation(reservationId) {
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      UPDATE reservations 
      SET status = 'cancelled', cancelled_at = NOW()
      WHERE id = ${reservationId}
    `;
        return {
            error: null
        };
    } catch (error) {
        console.error("Cancel reservation error:", error);
        return {
            error: "Failed to cancel reservation"
        };
    }
}
async function getReservationStats() {
    try {
        const stats = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'active') as active,
        COUNT(*) FILTER (WHERE status = 'fulfilled') as fulfilled,
        COUNT(*) FILTER (WHERE status = 'expired') as expired,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled
      FROM reservations
    `;
        return stats[0];
    } catch (error) {
        console.error("Get reservation stats error:", error);
        return {
            active: 0,
            fulfilled: 0,
            expired: 0,
            cancelled: 0
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getReservations,
    getUserReservations,
    createReservation,
    fulfillReservation,
    cancelReservation,
    getReservationStats
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getReservations, "408e91126ad82588e341a6b22f37af06cf9e4cb2a2", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserReservations, "403a925e5eee22eee7ecf7176965c650d4c8554c78", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createReservation, "40d1e1bef013e4032638d2a38e90df50c41ac4c2b4", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(fulfillReservation, "4078a3f97f48e385babf077fab08135bfe72de7eec", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(cancelReservation, "4059f65252b88b9655c26fd08a5cf8ca64eb23b2ff", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getReservationStats, "0003e72aa1bcba511bf4dbd2e5c21f143fca7490f5", null);
}),
"[project]/Downloads/libra-link-student-app (2)/lib/actions/auth-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"0039632f10247d81b5a312638e6c83268c5cc2ead4":"logoutAction","00a24f5bd2d28777fe372dda624d510eb3d2655162":"getCurrentUser","40a51273def11839afb7551d0718b60f548c95e320":"loginAction","40f6960c5583b71c0476ac6c736a9d4d040349a52d":"registerAction"},"",""] */ __turbopack_context__.s([
    "getCurrentUser",
    ()=>getCurrentUser,
    "loginAction",
    ()=>loginAction,
    "logoutAction",
    ()=>logoutAction,
    "registerAction",
    ()=>registerAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/node_modules/.pnpm/next@16.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/lib/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/node_modules/.pnpm/next@16.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/node_modules/.pnpm/next@16.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/node_modules/.pnpm/next@16.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/node_modules/.pnpm/next@16.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
async function loginAction(formData) {
    const email = formData.get("email");
    const password = formData.get("password");
    const { user, token, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signIn"])(email, password);
    if (error || !token) {
        return {
            error: error || "Failed to sign in"
        };
    }
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.set("session_token", token, {
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/"
    });
    // Redirect based on role
    if (user?.role === "admin") {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/admin");
    } else if (user?.role === "librarian") {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/librarian");
    } else {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/dashboard");
    }
}
async function registerAction(formData) {
    const email = formData.get("email");
    const password = formData.get("password");
    const fullName = formData.get("fullName");
    const universityId = formData.get("universityId");
    const universityName = formData.get("universityName");
    const { user, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signUp"])(email, password, fullName, universityId, universityName);
    if (error || !user) {
        return {
            error: error || "Failed to create account"
        };
    }
    // Auto sign in after registration
    const { token, error: signInError } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signIn"])(email, password);
    if (signInError || !token) {
        return {
            error: "Account created. Please sign in."
        };
    }
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.set("session_token", token, {
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/"
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/dashboard");
}
async function logoutAction() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get("session_token")?.value;
    if (token) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signOut"])(token);
        cookieStore.delete("session_token");
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/login");
}
async function getCurrentUser() {
    const { user } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
    return user;
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    loginAction,
    registerAction,
    logoutAction,
    getCurrentUser
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(loginAction, "40a51273def11839afb7551d0718b60f548c95e320", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(registerAction, "40f6960c5583b71c0476ac6c736a9d4d040349a52d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(logoutAction, "0039632f10247d81b5a312638e6c83268c5cc2ead4", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCurrentUser, "00a24f5bd2d28777fe372dda624d510eb3d2655162", null);
}),
"[project]/Downloads/libra-link-student-app (2)/.next-internal/server/app/librarian/reservations/page/actions.js { ACTIONS_MODULE0 => \"[project]/Downloads/libra-link-student-app (2)/lib/actions/reservation-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/Downloads/libra-link-student-app (2)/lib/actions/auth-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$reservation$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/lib/actions/reservation-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/lib/actions/auth-actions.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
}),
"[project]/Downloads/libra-link-student-app (2)/.next-internal/server/app/librarian/reservations/page/actions.js { ACTIONS_MODULE0 => \"[project]/Downloads/libra-link-student-app (2)/lib/actions/reservation-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/Downloads/libra-link-student-app (2)/lib/actions/auth-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "0003e72aa1bcba511bf4dbd2e5c21f143fca7490f5",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$reservation$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getReservationStats"],
    "0039632f10247d81b5a312638e6c83268c5cc2ead4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logoutAction"],
    "403a925e5eee22eee7ecf7176965c650d4c8554c78",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$reservation$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserReservations"],
    "4059f65252b88b9655c26fd08a5cf8ca64eb23b2ff",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$reservation$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cancelReservation"],
    "4078a3f97f48e385babf077fab08135bfe72de7eec",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$reservation$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fulfillReservation"],
    "408e91126ad82588e341a6b22f37af06cf9e4cb2a2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$reservation$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getReservations"],
    "40d1e1bef013e4032638d2a38e90df50c41ac4c2b4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$reservation$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createReservation"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f2e$next$2d$internal$2f$server$2f$app$2f$librarian$2f$reservations$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$reservation$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/Downloads/libra-link-student-app (2)/.next-internal/server/app/librarian/reservations/page/actions.js { ACTIONS_MODULE0 => "[project]/Downloads/libra-link-student-app (2)/lib/actions/reservation-actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/Downloads/libra-link-student-app (2)/lib/actions/auth-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$reservation$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/lib/actions/reservation-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/lib/actions/auth-actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1265f00e._.js.map