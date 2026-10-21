// API xatolari: frontend `code` bo'yicha 3 tilli matnni o'zi tanlaydi.
export class ApiError extends Error {
  constructor(status, code, details) {
    super(code);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const badRequest = (details) => new ApiError(400, 'VALIDATION', details);
export const notFound = () => new ApiError(404, 'NOT_FOUND');

// zod sxemasi bo'yicha tekshiradi; xato bo'lsa maydonlar ro'yxati bilan 400 qaytaradi.
export function parse(schema, value) {
  const r = schema.safeParse(value);
  if (!r.success) {
    throw badRequest(r.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })));
  }
  return r.data;
}
