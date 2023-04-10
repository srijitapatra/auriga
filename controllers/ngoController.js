import db from '../utils/db.js';

const conn = db();

// Renders NGO's landing page.
export const renderLanding = (req, res, next) => {
    let template = 'theme/multipage/index';

    const stmt = conn.prepare(
        'SELECT ngo_id, name, description, theme, phone, image, upi FROM ngo_detail WHERE name = ?'
    );
    const detail = stmt.get(req.params.name);

    if (detail.theme === 'singlepage') {
        const stmtEvent = conn.prepare(
            'SELECT name, description, starts, ends, image FROM ngo_event WHERE ngo_id = ?'
        );
        const events = stmtEvent.all(detail.ngo_id);
        return res.render('theme/singlepage', {detail, events});
    } else {
        return res.render('theme/multipage/index', {detail});
    }
};

// Renders NGO's event page.
export const renderEventPage = (req, res, next) => {
    let template = 'theme/multipage/events';

    const stmt = conn.prepare(
        'SELECT ngo_id, name, description, theme, image, upi FROM ngo_detail WHERE name = ?'
    );
    const detail = stmt.get(req.params.name);

    const stmtEvent = conn.prepare(
        'SELECT name, description, starts, ends FROM ngo_event WHERE ngo_id = ?'
    );
    const events = stmtEvent.all(detail.ngo_id);
    console.log(events);

    return res.render(template, {detail, events});
};

// Adds event to table.
export const eventCreate = (req, res, next) => {
    const b = req.body;
    const stmt = conn.prepare(
        'INSERT INTO ngo_event (ngo_id, name, description, starts, ends) VALUES (?, ?, ?, ?, ?);'
    );
    stmt.run(req.session.user, b.name, b.description, b.starts, b.ends);
    res.redirect('/events?created')
};
