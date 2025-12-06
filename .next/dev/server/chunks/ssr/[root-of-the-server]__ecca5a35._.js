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
"[project]/Downloads/libra-link-student-app (2)/lib/actions/fine-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00d92f163d4d3a9c092262133a2b6957ce9f207933":"getFineStats","40223ebf5101120297dc33cdd83a44884588f3603f":"deleteFine","4069e902269e7d02c4e9d2657101bf65829600cfd9":"markFinePaid","40c23f86d4c18582f7e3b7de8ff0d96de5f7d92c39":"getFines","40c2840122405acab5109ecfd7d0837c2d238d59f4":"getUserFines","40f691b0a828018913aeeea33ac519585dc9a0ec47":"createFine","602bfc56017337e3cd3ee9a29d73857e35c2ceda13":"updateFine"},"",""] */ __turbopack_context__.s([
    "createFine",
    ()=>createFine,
    "deleteFine",
    ()=>deleteFine,
    "getFineStats",
    ()=>getFineStats,
    "getFines",
    ()=>getFines,
    "getUserFines",
    ()=>getUserFines,
    "markFinePaid",
    ()=>markFinePaid,
    "updateFine",
    ()=>updateFine
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/node_modules/.pnpm/next@16.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/lib/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/node_modules/.pnpm/next@16.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function getFines(status) {
    try {
        let query = `
      SELECT f.*, 
        jsonb_build_object('id', u.id, 'full_name', u.full_name, 'email', u.email, 'avatar_url', u.avatar_url) as user,
        CASE WHEN b.id IS NOT NULL THEN jsonb_build_object('id', b.id, 'title', b.title, 'cover_url', b.cover_url) ELSE NULL END as book
      FROM fines f
      INNER JOIN users u ON f.user_id = u.id
      LEFT JOIN books b ON f.book_id = b.id
    `;
        if (status) {
            query += ` WHERE f.status = '${status}'`;
        }
        query += ` ORDER BY f.created_at DESC`;
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"].unsafe(query);
        return result;
    } catch (error) {
        console.error("Get fines error:", error);
        return [];
    }
}
async function getUserFines(userId) {
    try {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      SELECT f.*, 
        jsonb_build_object('id', u.id, 'full_name', u.full_name, 'email', u.email) as user,
        CASE WHEN b.id IS NOT NULL THEN jsonb_build_object('id', b.id, 'title', b.title, 'cover_url', b.cover_url) ELSE NULL END as book
      FROM fines f
      INNER JOIN users u ON f.user_id = u.id
      LEFT JOIN books b ON f.book_id = b.id
      WHERE f.user_id = ${userId}
      ORDER BY f.created_at DESC
    `;
        return result;
    } catch (error) {
        console.error("Get user fines error:", error);
        return [];
    }
}
async function createFine(data) {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])([
            "librarian",
            "admin"
        ]);
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      INSERT INTO fines (user_id, book_id, amount, reason, description, created_by)
      VALUES (${data.user_id}, ${data.book_id || null}, ${data.amount}, ${data.reason}, ${data.description || null}, ${user.id})
      RETURNING *
    `;
        return {
            fine: result[0],
            error: null
        };
    } catch (error) {
        console.error("Create fine error:", error);
        return {
            fine: null,
            error: "Failed to create fine"
        };
    }
}
async function updateFine(id, data) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])([
            "librarian",
            "admin"
        ]);
        const updates = [];
        const values = [];
        Object.entries(data).forEach(([key, value])=>{
            if (value !== undefined) {
                updates.push(`${key} = $${values.length + 1}`);
                values.push(value);
            }
        });
        if (updates.length === 0) {
            return {
                error: "No updates provided"
            };
        }
        values.push(id);
        const query = `UPDATE fines SET ${updates.join(", ")} WHERE id = $${values.length}`;
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"].unsafe(query, values);
        return {
            error: null
        };
    } catch (error) {
        console.error("Update fine error:", error);
        return {
            error: "Failed to update fine"
        };
    }
}
async function markFinePaid(fineId) {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])([
            "librarian",
            "admin"
        ]);
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      UPDATE fines SET status = 'paid', paid_at = NOW() WHERE id = ${fineId}
    `;
        // Log the action
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      INSERT INTO system_logs (user_id, action, entity_type, entity_id, details)
      VALUES (${user.id}, 'fine_paid', 'fine', ${fineId}, '{}')
    `;
        return {
            error: null
        };
    } catch (error) {
        console.error("Mark fine paid error:", error);
        return {
            error: "Failed to mark fine as paid"
        };
    }
}
async function deleteFine(id) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])([
            "librarian",
            "admin"
        ]);
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`DELETE FROM fines WHERE id = ${id}`;
        return {
            error: null
        };
    } catch (error) {
        console.error("Delete fine error:", error);
        return {
            error: "Failed to delete fine"
        };
    }
}
async function getFineStats() {
    try {
        const stats = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      SELECT 
        COUNT(*) as total_fines,
        COUNT(*) FILTER (WHERE status = 'unpaid') as unpaid,
        COUNT(*) FILTER (WHERE status = 'paid') as paid,
        COALESCE(SUM(amount) FILTER (WHERE status = 'unpaid'), 0) as unpaid_amount,
        COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0) as paid_amount
      FROM fines
    `;
        return stats[0];
    } catch (error) {
        console.error("Get fine stats error:", error);
        return {
            total_fines: 0,
            unpaid: 0,
            paid: 0,
            unpaid_amount: 0,
            paid_amount: 0
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getFines,
    getUserFines,
    createFine,
    updateFine,
    markFinePaid,
    deleteFine,
    getFineStats
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getFines, "40c23f86d4c18582f7e3b7de8ff0d96de5f7d92c39", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserFines, "40c2840122405acab5109ecfd7d0837c2d238d59f4", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createFine, "40f691b0a828018913aeeea33ac519585dc9a0ec47", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateFine, "602bfc56017337e3cd3ee9a29d73857e35c2ceda13", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(markFinePaid, "4069e902269e7d02c4e9d2657101bf65829600cfd9", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteFine, "40223ebf5101120297dc33cdd83a44884588f3603f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getFineStats, "00d92f163d4d3a9c092262133a2b6957ce9f207933", null);
}),
"[project]/Downloads/libra-link-student-app (2)/lib/actions/user-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00464217d3aa7eb204663ec6785e809fb52281618c":"getCurrentUserProfile","00cdb95e9ea7d0fac6af409790773d5d5c50afc015":"getUserStats","4011e93eb655bb1a62654dc10bca933e3b4dcf3ac6":"createUser","402451b83d792fe39b97a67d95694c83011e634b98":"deleteUser","40a9b20b23ff43d28274199f48a308fe50ae6c8577":"getUserById","40e45acf41eaba917bc7c3e0a8fc992963f6662e1e":"updateCurrentUserProfile","602ce76d1a8522f52d884e4d2288db43728a5c5550":"updateUserStatus","604bb47d58f793eb688ba8408e6a82976b2ddc3843":"getUsers","606c1d0c07257dab807f552615834dda018a8ead9f":"updateCurrentUserPassword","6079f65735e49b3dc879f66419e3eafa3fd51dbc84":"updateUser","60f440baa352e67fc2246030d752f9eb3f86fd7d88":"updateUserRole"},"",""] */ __turbopack_context__.s([
    "createUser",
    ()=>createUser,
    "deleteUser",
    ()=>deleteUser,
    "getCurrentUserProfile",
    ()=>getCurrentUserProfile,
    "getUserById",
    ()=>getUserById,
    "getUserStats",
    ()=>getUserStats,
    "getUsers",
    ()=>getUsers,
    "updateCurrentUserPassword",
    ()=>updateCurrentUserPassword,
    "updateCurrentUserProfile",
    ()=>updateCurrentUserProfile,
    "updateUser",
    ()=>updateUser,
    "updateUserRole",
    ()=>updateUserRole,
    "updateUserStatus",
    ()=>updateUserStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/node_modules/.pnpm/next@16.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/lib/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/node_modules/.pnpm/next@16.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
function hashPassword(password) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash("sha256").update(password).digest("hex");
}
async function getUsers(role, search) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])([
        "admin"
    ]);
    let query = `SELECT * FROM users WHERE 1=1`;
    if (role) {
        query += ` AND role = '${role}'`;
    }
    if (search) {
        query += ` AND (full_name ILIKE '%${search}%' OR email ILIKE '%${search}%' OR university_id ILIKE '%${search}%')`;
    }
    query += ` ORDER BY created_at DESC`;
    const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"].unsafe(query);
    return result;
}
async function getUserById(id) {
    const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`SELECT * FROM users WHERE id = ${id}`;
    return result.length > 0 ? result[0] : null;
}
async function getCurrentUserProfile() {
    const { user } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
    return user;
}
async function createUser(data) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])([
            "admin"
        ]);
        // Check if email exists
        const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`SELECT id FROM users WHERE email = ${data.email}`;
        if (existing.length > 0) {
            return {
                user: null,
                error: "Email already exists"
            };
        }
        const passwordHash = hashPassword(data.password);
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      INSERT INTO users (email, password_hash, full_name, role, university_id, university_name, department, year_level, course)
      VALUES (${data.email}, ${passwordHash}, ${data.full_name}, ${data.role}, 
              ${data.university_id || null}, ${data.university_name || null}, ${data.department || null},
              ${data.year_level || null}, ${data.course || null})
      RETURNING *
    `;
        return {
            user: result[0],
            error: null
        };
    } catch (error) {
        console.error("Create user error:", error);
        return {
            user: null,
            error: "Failed to create user"
        };
    }
}
async function updateUser(id, data) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])([
            "admin"
        ]);
        const updates = [];
        const values = [];
        Object.entries(data).forEach(([key, value])=>{
            if (value !== undefined) {
                updates.push(`${key} = $${values.length + 1}`);
                values.push(value);
            }
        });
        if (updates.length === 0) {
            return {
                user: null,
                error: "No updates provided"
            };
        }
        values.push(id);
        const query = `UPDATE users SET ${updates.join(", ")} WHERE id = $${values.length} RETURNING *`;
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"].unsafe(query, values);
        return {
            user: result[0],
            error: null
        };
    } catch (error) {
        console.error("Update user error:", error);
        return {
            user: null,
            error: "Failed to update user"
        };
    }
}
async function updateUserRole(id, role) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])([
            "admin"
        ]);
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`UPDATE users SET role = ${role} WHERE id = ${id}`;
        return {
            error: null
        };
    } catch (error) {
        console.error("Update role error:", error);
        return {
            error: "Failed to update role"
        };
    }
}
async function updateUserStatus(id, status) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])([
            "admin"
        ]);
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`UPDATE users SET status = ${status} WHERE id = ${id}`;
        return {
            error: null
        };
    } catch (error) {
        console.error("Update status error:", error);
        return {
            error: "Failed to update status"
        };
    }
}
async function deleteUser(id) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])([
            "admin"
        ]);
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`DELETE FROM users WHERE id = ${id}`;
        return {
            error: null
        };
    } catch (error) {
        console.error("Delete user error:", error);
        return {
            error: "Failed to delete user"
        };
    }
}
async function getUserStats() {
    const stats = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
    SELECT 
      COUNT(*) as total_users,
      COUNT(*) FILTER (WHERE role = 'student') as students,
      COUNT(*) FILTER (WHERE role = 'faculty') as faculty,
      COUNT(*) FILTER (WHERE role = 'librarian') as librarians,
      COUNT(*) FILTER (WHERE role = 'admin') as admins,
      COUNT(*) FILTER (WHERE status = 'active') as active_users
    FROM users
  `;
    return stats[0];
}
async function updateCurrentUserProfile(data) {
    try {
        const { user } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
        if (!user) {
            return {
                user: null,
                error: "Not authenticated"
            };
        }
        const updates = [];
        const values = [];
        if (data.full_name) {
            updates.push(`full_name = $${values.length + 1}`);
            values.push(data.full_name);
        }
        if (data.email) {
            // Check if email is already taken by another user
            const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`SELECT id FROM users WHERE email = ${data.email} AND id != ${user.id}`;
            if (existing.length > 0) {
                return {
                    user: null,
                    error: "Email already in use"
                };
            }
            updates.push(`email = $${values.length + 1}`);
            values.push(data.email);
        }
        if (updates.length === 0) {
            return {
                user: null,
                error: "No updates provided"
            };
        }
        values.push(user.id);
        const query = `UPDATE users SET ${updates.join(", ")} WHERE id = $${values.length} RETURNING *`;
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"].unsafe(query, values);
        return {
            user: result[0],
            error: null
        };
    } catch (error) {
        console.error("Update profile error:", error);
        return {
            user: null,
            error: "Failed to update profile"
        };
    }
}
async function updateCurrentUserPassword(currentPassword, newPassword) {
    try {
        const { user } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
        if (!user) {
            return {
                error: "Not authenticated"
            };
        }
        // Verify current password
        const currentHash = hashPassword(currentPassword);
        const userRecord = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`SELECT password_hash FROM users WHERE id = ${user.id}`;
        if (userRecord.length === 0 || userRecord[0].password_hash !== currentHash) {
            return {
                error: "Current password is incorrect"
            };
        }
        // Update to new password
        const newHash = hashPassword(newPassword);
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`UPDATE users SET password_hash = ${newHash} WHERE id = ${user.id}`;
        return {
            error: null
        };
    } catch (error) {
        console.error("Update password error:", error);
        return {
            error: "Failed to change password"
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getUsers,
    getUserById,
    getCurrentUserProfile,
    createUser,
    updateUser,
    updateUserRole,
    updateUserStatus,
    deleteUser,
    getUserStats,
    updateCurrentUserProfile,
    updateCurrentUserPassword
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUsers, "604bb47d58f793eb688ba8408e6a82976b2ddc3843", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserById, "40a9b20b23ff43d28274199f48a308fe50ae6c8577", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCurrentUserProfile, "00464217d3aa7eb204663ec6785e809fb52281618c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createUser, "4011e93eb655bb1a62654dc10bca933e3b4dcf3ac6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateUser, "6079f65735e49b3dc879f66419e3eafa3fd51dbc84", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateUserRole, "60f440baa352e67fc2246030d752f9eb3f86fd7d88", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateUserStatus, "602ce76d1a8522f52d884e4d2288db43728a5c5550", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteUser, "402451b83d792fe39b97a67d95694c83011e634b98", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserStats, "00cdb95e9ea7d0fac6af409790773d5d5c50afc015", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateCurrentUserProfile, "40e45acf41eaba917bc7c3e0a8fc992963f6662e1e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateCurrentUserPassword, "606c1d0c07257dab807f552615834dda018a8ead9f", null);
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
"[project]/Downloads/libra-link-student-app (2)/.next-internal/server/app/admin/fines/page/actions.js { ACTIONS_MODULE0 => \"[project]/Downloads/libra-link-student-app (2)/lib/actions/fine-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/Downloads/libra-link-student-app (2)/lib/actions/user-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/Downloads/libra-link-student-app (2)/lib/actions/auth-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$fine$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/lib/actions/fine-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$user$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/lib/actions/user-actions.ts [app-rsc] (ecmascript)");
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
;
;
;
;
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
"[project]/Downloads/libra-link-student-app (2)/.next-internal/server/app/admin/fines/page/actions.js { ACTIONS_MODULE0 => \"[project]/Downloads/libra-link-student-app (2)/lib/actions/fine-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/Downloads/libra-link-student-app (2)/lib/actions/user-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/Downloads/libra-link-student-app (2)/lib/actions/auth-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "0039632f10247d81b5a312638e6c83268c5cc2ead4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logoutAction"],
    "00464217d3aa7eb204663ec6785e809fb52281618c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$user$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentUserProfile"],
    "00cdb95e9ea7d0fac6af409790773d5d5c50afc015",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$user$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserStats"],
    "00d92f163d4d3a9c092262133a2b6957ce9f207933",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$fine$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFineStats"],
    "4011e93eb655bb1a62654dc10bca933e3b4dcf3ac6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$user$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createUser"],
    "40223ebf5101120297dc33cdd83a44884588f3603f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$fine$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteFine"],
    "402451b83d792fe39b97a67d95694c83011e634b98",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$user$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteUser"],
    "4069e902269e7d02c4e9d2657101bf65829600cfd9",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$fine$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["markFinePaid"],
    "40a9b20b23ff43d28274199f48a308fe50ae6c8577",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$user$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserById"],
    "40c23f86d4c18582f7e3b7de8ff0d96de5f7d92c39",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$fine$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFines"],
    "40c2840122405acab5109ecfd7d0837c2d238d59f4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$fine$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserFines"],
    "40e45acf41eaba917bc7c3e0a8fc992963f6662e1e",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$user$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateCurrentUserProfile"],
    "40f691b0a828018913aeeea33ac519585dc9a0ec47",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$fine$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createFine"],
    "602bfc56017337e3cd3ee9a29d73857e35c2ceda13",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$fine$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateFine"],
    "602ce76d1a8522f52d884e4d2288db43728a5c5550",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$user$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateUserStatus"],
    "604bb47d58f793eb688ba8408e6a82976b2ddc3843",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$user$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUsers"],
    "606c1d0c07257dab807f552615834dda018a8ead9f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$user$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateCurrentUserPassword"],
    "6079f65735e49b3dc879f66419e3eafa3fd51dbc84",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$user$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateUser"],
    "60f440baa352e67fc2246030d752f9eb3f86fd7d88",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$user$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateUserRole"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$fines$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$fine$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$user$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/Downloads/libra-link-student-app (2)/.next-internal/server/app/admin/fines/page/actions.js { ACTIONS_MODULE0 => "[project]/Downloads/libra-link-student-app (2)/lib/actions/fine-actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/Downloads/libra-link-student-app (2)/lib/actions/user-actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/Downloads/libra-link-student-app (2)/lib/actions/auth-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$fine$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/lib/actions/fine-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$user$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/lib/actions/user-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$libra$2d$link$2d$student$2d$app__$28$2$292f$lib$2f$actions$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/libra-link-student-app (2)/lib/actions/auth-actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ecca5a35._.js.map