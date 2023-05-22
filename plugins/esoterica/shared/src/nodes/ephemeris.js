// index.js
/**
 * Ephemeris namespace
 */
let ephemeris = {};

let $ns = ephemeris;

// common.js
$ns.copy = function (target /*, source ... */) {
	if (target) {
		for (var i = arguments.length - 1; i > 0; i --) {
			var source = arguments [i];
			if (source && source.hasOwnProperty) {
				for (var key in source) {
					if (source.hasOwnProperty (key)) {
						target [key] = source [key];
					}
				}
			}
		}
	}
    return target;
};

$ns.is = function (object, type) {
	var typeName = Object.prototype.toString.call (object).slice (8, -1);
	return (
		object !== undefined &&
		object !== null &&
		type.name === typeName
	);
};

$ns.make = function (context, path) {
	if ($is (context, String)) {
		path = context;
		context = document;
	}

	if (path) {
		var paths = path.split ('.');
		var key = paths.shift ();
		context [key] = context [key] || {};
		context = $make (context [key], paths.join ('.'));
	}
	return context;
};

$ns.define = function (context, path, object) {
	$copy ($make (context, path), object);
};

$ns.assert = function (variable, value) {
	if (variable != value) {
		throw 'Assertion failed: ' + variable + ' != ' + value + '!';
	}
};


// load.js
$ns.load = function () {
    var curDate = new Date ();
	var dateArea = document.getElementById ('$const.date');
    dateArea.value = curDate.getDate () + '.' + (curDate.getMonth () + 1) + '.' + curDate.getFullYear () + ' ' +
        curDate.getHours () + ':' + curDate.getMinutes () + ':' + curDate.getSeconds ()
    ;

    $ns.update ();
};

$ns.update = function () {
	var textAreas = document.body.getElementsByTagName ('textarea');
	var selects = document.body.getElementsByTagName ('select');
	var classes, ids, value, date;
	var i, j, key;

	//$processor.test ();

	// fill input
	if (textAreas) {
		for (i = 0; i < textAreas.length; i ++) {
			ids = textAreas [i].getAttribute ('id');
			try {
				eval ('' + ids + ' = "' + textAreas [i].value + '"');
			} catch (exception) {
			}
		}
	}

	if ($const.date) {
		var tokens = $const.date.split (' ');

		tokens [0] = tokens [0].split ('.');
		tokens [1] = tokens [1].split (':');

		date = {
			day: parseFloat (tokens [0][0]),
			month: parseFloat (tokens [0][1]),
			year: parseFloat (tokens [0][2]),
			hours: parseFloat (tokens [1][0]),
			minutes: parseFloat (tokens [1][1]),
			seconds: parseFloat (tokens [1][2])
		};
		$const.date = date;
	}

	$processor.init ();

	// fill input bodies
	if (selects) {
		for (i = 0; i < selects.length; i ++) {
			classes = selects [i].getAttribute ('class');
			ids = selects [i].getAttribute ('id');
			if (classes) {
				try {
					var selector = eval ('(' + classes + ')');
					if (!selects [i].innerHTML) {
						var selections = [];
						for (key in selector) {
							if (selector.hasOwnProperty (key) && selector [key].key == key && key != 'earth') {
								selections.push ('<option label=' + key + '>' + key + '</option>');
							}
						}
						selects [i].innerHTML = selections;
					}
					eval (ids + ' = ' + classes + '.' + selects [i].value);
				} catch (exception) {
				}
			}
		}
	}

	$processor.calc (date, $const.body);

	// fill output
	if (textAreas) {
		for (i = 0; i < textAreas.length; i ++) {
			classes = (textAreas [i].getAttribute ('class') || '').split (' ');
			for (j = 0; j < classes.length; j ++) {
				try {
					value = eval ('(' + classes [j] + ')');
					if (value || value === 0) {
						textAreas [i].value = value.join ? value.join ('\n') : value;
						break;
					}
				} catch (exception) {
				}
			}
		}
	}
};

// index.js
$ns = ephemeris.astronomy = {};

// index.js
$ns = ephemeris.astronomy.moshier = {};

// constant.js
$ns.constant = {
	/* Standard epochs.  Note Julian epochs (J) are measured in
	 * years of 365.25 days.
	 */
	j2000: 2451545.0,	/* 2000 January 1.5 */
	b1950: 2433282.423,	/* 1950 January 0.923 Besselian epoch */
	j1900: 2415020.0,	/* 1900 January 0, 12h UT */
	RTOH: 12.0 / Math.PI, /* Radians to hours, minutes, seconds */


	/* Conversion factors between degrees and radians */
	DTR: 1.7453292519943295769e-2,
	RTD: 5.7295779513082320877e1,
	RTS: 2.0626480624709635516e5, /* arc seconds per radian */
	STR: 4.8481368110953599359e-6, /* radians per arc second */

	TPI: 2.0 * Math.PI,

	date: {}, /* Input date */

	tlong: -71.13,	/* Cambridge, Massachusetts */ // input for kinit
	tlat: 42.38, /* geocentric */ // input for kinit
	glat: 42.27, /* geodetic */ // input for kinit

	/* Parameters for calculation of azimuth and elevation
	 */
	attemp: 12.0,	/* atmospheric temperature, degrees Centigrade */ // input for kinit
	atpress: 1010.0, /* atmospheric pressure, millibars */ // input for kinit

	/* If the following number
	 * is nonzero, then the program will return it for delta T
	 * and not calculate anything.
	 */
	dtgiven: 0.0, // input for kinit

	/* Distance from observer to center of earth, in earth radii
	 */
	trho: 0.9985,
	flat: 298.257222,
	height: 0.0,

	/* Radius of the earth in au
	 Thanks to Min He <Min.He@businessobjects.com> for pointing out
	 this needs to be initialized early.  */
	Rearth: 0.0, // calculated in kinit

	/* Constants used elsewhere. These are DE403 values. */
	aearth: 6378137.,  /* Radius of the earth, in meters.  */
	au: 1.49597870691e8, /* Astronomical unit, in kilometers.  */
	emrat: 81.300585,  /* Earth/Moon mass ratio.  */
	Clight: 2.99792458e5,  /* Speed of light, km/sec  */
	Clightaud: 0.0, /* C in au/day  */

	/* approximate motion of right ascension and declination
	 * of object, in radians per day
	 */
	dradt: 0.0,
	ddecdt: 0.0,

	SE: 0.0,	/* earth-sun distance */
	SO: 0.0,	/* object-sun distance */
	EO: 0.0,	/* object-earth distance */

	pq: 0.0,	/* cosine of sun-object-earth angle */
	ep: 0.0,	/* -cosine of sun-earth-object angle */
	qe: 0.0,	/* cosine of earth-sun-object angle */

	/* correction vector, saved for display  */
	dp: [],

	/*
	 * Current kepler body
	 */
	body: {}
};
// julian.js
$ns.julian = {};

$ns.julian.calc = function (date) {
	var centuries;
	var year;
	var month;
	var b = 0;
	var c;
	var e;

	/* The origin should be chosen to be a century year
	 * that is also a leap year.  We pick 4801 B.C.
	 */
	year = date.year + 4800;
	if (date.year < 0) {
		year += 1;
	}

	/* The following magic arithmetic calculates a sequence
	 * whose successive terms differ by the correct number of
	 * days per calendar month.  It starts at 122 = March; January
	 * and February come after December.
	 */
	month = date.month;
	if (month <= 2) {
		month += 12;
		year -= 1;
	}
	e = Math.floor ((306 * (month + 1)) / 10);

	// number of centuries
	centuries = Math.floor (year / 100);

	if (date.year <= 1582) {
		if (date.year == 1582) {
			if (date.month < 10) {
				b = -38;
			}
			if (date.month > 10 || date.day >= 15) {
				// number of century years that are not leap years
				b = Math.floor ((centuries / 4) - centuries);
			}
		}
	} else {
		b = Math.floor ((centuries / 4) - centuries);
	}

	// Julian calendar years and leap years
	c = Math.floor ((36525 * year) / 100);

	/* Add up these terms, plus offset from J 0 to 1 Jan 4801 B.C.
	 * Also fudge for the 122 days from the month algorithm.
	 */
	date.julianDate = b + c + e + date.day - 32167.5;

	// Add time
	date.julianTime = (3600.0 * date.hours + 60.0 * date.minutes + date.seconds) / 86400.0;

	date.julian = date.julianDate + date.julianTime;

	date.j2000 = 2000.0 + (date.julian - $const.j2000) / 365.25;
	date.b1950 = 1950.0 + (date.julian - $const.b1950) / 365.25;
	date.j1900 = 1900.0 + (date.julian - $const.j1900) / 365.25;

	return date.julian;
};

$ns.julian.toGregorian = function (date) {
	var month, day; // int
	var year, a, c, d, x, y, jd; // int
	var BC; // int
	var dd; // double
	var J = date.julian;

	/* January 1.0, 1 A.D. */
	if( J < 1721423.5 ) {
		BC = 1;
	} else {
		BC = 0;
	}

	jd = Math.floor (J + 0.5); /* round Julian date up to integer */

	/* Find the number of Gregorian centuries
	 * since March 1, 4801 B.C.
	 */
	a = Math.floor ((100 * jd + 3204500)/3652425);

	/* Transform to Julian calendar by adding in Gregorian century years
	 * that are not leap years.
	 * Subtract 97 days to shift origin of JD to March 1.
	 * Add 122 days for magic arithmetic algorithm.
	 * Add four years to ensure the first leap year is detected.
	 */
	c = jd + 1486;
	if( jd >= 2299160.5 ) {
		c += a - Math.floor (a / 4);
	} else {
		c += 38;
	}
	/* Offset 122 days, which is where the magic arithmetic
	 * month formula sequence starts (March 1 = 4 * 30.6 = 122.4).
	 */
	d = Math.floor ((100 * c - 12210)/36525);
	/* Days in that many whole Julian years */
	x = Math.floor ((36525 * d) / 100);

	/* Find month and day. */
	y = Math.floor (((c-x) * 100) / 3061);
	day = Math.floor (c - x - Math.floor ((306 * y) / 10));
	month = Math.floor (y - 1);
	if ( y > 13 ) {
		month -= 12;
	}

	/* Get the year right. */
	year = d - 4715;
	if (month > 2 ) {
		year -= 1;
	}

	/* Fractional part of day. */
	dd = day + J - jd + 0.5;

	if (BC) {
		year = year - 1;
	}

	date.year = year;
	date.month = month;

	date.day = Math.floor (dd);

	/* Display fraction of calendar day
	 * as clock time.
	 */
	a = Math.floor (dd);
	dd = dd - a;
	x = 2.0 * Math.PI * dd;

	$copy (date, $util.hms (x));

	return date;
};
// delta.js
$ns.delta = {};

/**
 * Morrison and Stephenson (2004)
 * This table covers -1000 through 1700 in 100-year steps.
 * Values are in whole seconds.
 * Estimated standard error at -1000 is 640 seconds; at 1600, 20 seconds.
 * The first value in the table has been adjusted 28 sec for
 * continuity with their long-term quadratic extrapolation formula.
 * The last value in this table agrees with the AA table at 1700,
 * so there is no discontinuity at either endpoint.
 */
$ns.delta.m_s = [
	/* -1000 to -100 */
	25428, 23700, 22000, 21000, 19040, 17190, 15530, 14080, 12790, 11640,
	/* 0 to 900 */
	10580, 9600, 8640, 7680, 6700, 5710, 4740, 3810, 2960, 2200,
	/* 1000 to 1700 */
	1570, 1090, 740, 490, 320, 200, 120, 9
];

/**
 * Entries prior to 1955 in the following table are from
 * the 1984 Astronomical Almanac and assume ndot = -26.0.
 * For dates prior to 1700, the above table is used instead of this one.
 */
$ns.delta.dt = [
	/* 1620.0 thru 1659.0 */
	12400, 11900, 11500, 11000, 10600, 10200, 9800, 9500, 9100, 8800,
	8500, 8200, 7900, 7700, 7400, 7200, 7000, 6700, 6500, 6300,
	6200, 6000, 5800, 5700, 5500, 5400, 5300, 5100, 5000, 4900,
	4800, 4700, 4600, 4500, 4400, 4300, 4200, 4100, 4000, 3800,
	/* 1660.0 thru 1699.0 */
	3700, 3600, 3500, 3400, 3300, 3200, 3100, 3000, 2800, 2700,
	2600, 2500, 2400, 2300, 2200, 2100, 2000, 1900, 1800, 1700,
	1600, 1500, 1400, 1400, 1300, 1200, 1200, 1100, 1100, 1000,
	1000, 1000, 900, 900, 900, 900, 900, 900, 900, 900,
	/* 1700.0 thru 1739.0 */
	900, 900, 900, 900, 900, 900, 900, 900, 1000, 1000,
	1000, 1000, 1000, 1000, 1000, 1000, 1000, 1100, 1100, 1100,
	1100, 1100, 1100, 1100, 1100, 1100, 1100, 1100, 1100, 1100,
	1100, 1100, 1100, 1100, 1200, 1200, 1200, 1200, 1200, 1200,
	/* 1740.0 thru 1779.0 */
	1200, 1200, 1200, 1200, 1300, 1300, 1300, 1300, 1300, 1300,
	1300, 1400, 1400, 1400, 1400, 1400, 1400, 1400, 1500, 1500,
	1500, 1500, 1500, 1500, 1500, 1600, 1600, 1600, 1600, 1600,
	1600, 1600, 1600, 1600, 1600, 1700, 1700, 1700, 1700, 1700,
	/* 1780.0 thru 1799.0 */
	1700, 1700, 1700, 1700, 1700, 1700, 1700, 1700, 1700, 1700,
	1700, 1700, 1600, 1600, 1600, 1600, 1500, 1500, 1400, 1400,
	/* 1800.0 thru 1819.0 */
	1370, 1340, 1310, 1290, 1270, 1260, 1250, 1250, 1250, 1250,
	1250, 1250, 1250, 1250, 1250, 1250, 1250, 1240, 1230, 1220,
	/* 1820.0 thru 1859.0 */
	1200, 1170, 1140, 1110, 1060, 1020, 960, 910, 860, 800,
	750, 700, 660, 630, 600, 580, 570, 560, 560, 560,
	570, 580, 590, 610, 620, 630, 650, 660, 680, 690,
	710, 720, 730, 740, 750, 760, 770, 770, 780, 780,
	/* 1860.0 thru 1899.0 */
	788, 782, 754, 697, 640, 602, 541, 410, 292, 182,
	161, 10, -102, -128, -269, -324, -364, -454, -471, -511,
	-540, -542, -520, -546, -546, -579, -563, -564, -580, -566,
	-587, -601, -619, -664, -644, -647, -609, -576, -466, -374,
	/* 1900.0 thru 1939.0 */
	-272, -154, -2, 124, 264, 386, 537, 614, 775, 913,
	1046, 1153, 1336, 1465, 1601, 1720, 1824, 1906, 2025, 2095,
	2116, 2225, 2241, 2303, 2349, 2362, 2386, 2449, 2434, 2408,
	2402, 2400, 2387, 2395, 2386, 2393, 2373, 2392, 2396, 2402,
	/* 1940.0 thru 1979.0 */
	2433, 2483, 2530, 2570, 2624, 2677, 2728, 2778, 2825, 2871,
	2915, 2957, 2997, 3036, 3072, 3107, 3135, 3168, 3218, 3268,
	3315, 3359, 3400, 3447, 3503, 3573, 3654, 3743, 3829, 3920,
	4018, 4117, 4223, 4337, 4449, 4548, 4646, 4752, 4853, 4959,
	/* 1980.0 thru 2011.0 */
	5054, 5138, 5217, 5296, 5379, 5434, 5487, 5532, 5582, 5630,
	5686, 5757, 5831, 5912, 5998, 6078, 6163, 6230, 6297, 6347,
	6383, 6409, 6430, 6447, 6457, 6469, 6485, 6515, 6546, 6578,
	6607, 6632
];

$ns.delta.demo = 0;
$ns.delta.TABSTART = 1620;
$ns.delta.TABEND = 2011;
$ns.delta.TABSIZ = ($ns.delta.TABEND - $ns.delta.TABSTART + 1);

$ns.delta.calc = function (date) {
	var p, B; // double
	var diff = [0, 0, 0, 0, 0, 0]; // int
	var i, iy, k; // int

	if ($const.dtgiven) {
		date.delta = $const.dtgiven;
	} else if (date.j2000 > this.TABEND) {
		/* Extrapolate future values beyond the lookup table.  */
		if (date.j2000 > (this.TABEND + 100.0)) {
			/* Morrison & Stephenson (2004) long-term curve fit.  */
			B = (date.j2000 - 1820.0) / 100;
			date.delta = 32.0 * B * B - 20.0;
		} else {
			var a, b, c, d, m0, m1; // double

			/* Cubic interpolation between last tabulated value
			 and long-term curve evaluated at 100 years later.  */

			/* Last tabulated delta T value. */
			a = this.dt [this.TABSIZ - 1] / 100;
			/* Approximate slope in past 10 years. */
			b = (this.dt [this.TABSIZ - 1] - this.dt [this.TABSIZ - 11]) / 1000;

			/* Long-term curve 100 years hence. */
			B = (this.TABEND + 100.0 - 1820.0) / 100;
			m0 = 32.0 * B * B - 20.0;
			/* Its slope. */
			m1 = 0.64 * B;

			/* Solve for remaining coefficients of an interpolation polynomial
			 that agrees in value and slope at both ends of the 100-year
			 interval. */
			d = 2.0e-6 * (50.0 * (m1 + b) - m0 + a);
			c = 1.0e-4 * (m0 - a - 100.0 * b - 1.0e6 * d);

			/* Note, the polynomial coefficients do not depend on Y.
			 A given tabulation and long-term formula
			 determine the polynomial.
			 Thus, for the IERS table ending at 2011.0, the coefficients are
			 a = 66.32
			 b = 0.223
			 c = 0.03231376
			 d = -0.0001607784
			 */

			/* Compute polynomial value at desired time. */
			p = date.j2000 - this.TABEND;
			date.delta = a + p * (b + p * (c + p * d));
		}
	} else {
		/* Use Morrison and Stephenson (2004) prior to the year 1700.  */
		if (date.j2000 < 1700.0) {
			if (date.j2000 <= -1000.0) {
				/* Morrison and Stephenson long-term fit.  */
				B = (date.j2000 - 1820.0) / 100;
				date.delta = 32.0 * B * B - 20.0;
			} else {
				/* Morrison and Stephenson recommend linear interpolation
				 between tabulations. */
				iy = Math.floor (date.j2000);
				iy = Math.floor ((iy + 1000) / 100);
				/* Integer index into the table. */
				B = -1000 + 100 * iy;
				/* Starting year of tabulated interval.  */
				p = this.m_s [iy];
				date.delta = p + (date.j2000 - B) * (this.m_s [iy + 1] - p) / 100;
			}
		} else {
			/* Besselian interpolation between tabulated values
			 * in the telescopic era.
			 * See AA page K11.
			 */

			/* Index into the table.
			 */
			p = Math.floor (date.j2000);
			iy = Math.floor (p - this.TABSTART);
			/* Zeroth order estimate is value at start of year
			 */
			date.delta = this.dt [iy];
			k = iy + 1;
			if (!(k >= this.TABSIZ)) {
				/* The fraction of tabulation interval
				 */
				p = date.j2000 - p;

				/* First order interpolated value
				 */
				date.delta += p * (this.dt [k] - this.dt [iy]);
				if (!((iy - 1 < 0) || (iy + 2 >= this.TABSIZ))) {
					// make table of first differences
					k = iy - 2;
					for (i = 0; i < 5; i++) {
						if ((k < 0) || (k + 1 >= this.TABSIZ)) {
							diff[i] = 0;
						} else {
							diff[i] = this.dt[k + 1] - this.dt[k];
						}
						k += 1;
					}

					// compute second differences
					for (i = 0; i < 4; i++) {
						diff[i] = diff[i + 1] - diff[i];
					}
					B = 0.25 * p * (p - 1.0);
					date.delta += B * (diff[1] + diff[2]);

					if (!(iy + 2 >= this.TABSIZ)) {
						// Compute third differences
						for (i = 0; i < 3; i++) {
							diff[i] = diff[i + 1] - diff[i];
						}
						B = 2.0 * B / 3.0;
						date.delta += (p - 0.5) * B * diff[1];
						if (!((iy - 2 < 0) || (iy + 3 > this.TABSIZ))) {
							// Compute fourth differences
							for (i = 0; i < 2; i++) {
								diff[i] = diff[i + 1] - diff[i];
							}
							B = 0.125 * B * (p + 1.0) * (p - 2.0);
							date.delta += B * (diff[0] + diff[1]);
						}
					}
				}
			}
		}
		date.delta /= 100.0;
	}

	date.terrestrial = date.julian;
	date.universal = date.terrestrial - date.delta / 86400.0;

	return date.delta;
};

// epsilon.js
$ns.epsilon = {
	/* The results of the program are returned in these
	 * global variables:
	 */
	jdeps: -1.0, /* Date for which obliquity was last computed */
	eps: 0.0, /* The computed obliquity in radians */
	coseps: 0.0, /* Cosine of the obliquity */
	sineps: 0.0 /* Sine of the obliquity */
};

$ns.epsilon.calc = function (date) {
	var T; // double

	if (date.julian == this.jdeps) {
		return;
	}
	T = (date.julian - 2451545.0)/36525.0;

	/* DE403 values. */
		T /= 10.0;
	this.eps = ((((((((( 2.45e-10*T + 5.79e-9)*T + 2.787e-7)*T
		+ 7.12e-7)*T - 3.905e-5)*T - 2.4967e-3)*T
		- 5.138e-3)*T + 1.9989)*T - 0.0175)*T - 468.33960)*T
		+ 84381.406173;
	this.eps *= $const.STR;

	this.coseps = Math.cos( this.eps );
	this.sineps = Math.sin( this.eps );
	this.jdeps = date.julian;
};
// lonlat.js
$ns.lonlat = {};

$ns.lonlat.calc = function (pp, date, polar, ofdate, result) {
	var s = [], x, y, z, yy, zz, r; // double
	var i; // int

	result = result || {};

	/* Make local copy of position vector
	 * and calculate radius.
	 */
	r = 0.0;
	for( i=0; i<3; i++ ) {
		x = pp [i];
		s [i] = x;
		r += x * x;
	}
	r = Math.sqrt(r);

	/* Precess to equinox of date J
	 */
	if( ofdate ) {
		$moshier.precess.calc ( s, date, -1 );
	}

	/* Convert from equatorial to ecliptic coordinates
	 */
	$moshier.epsilon.calc (date);
	yy = s[1];
	zz = s[2];
	x  = s[0];
	y  =  $moshier.epsilon.coseps * yy  +  $moshier.epsilon.sineps * zz;
	z  = -$moshier.epsilon.sineps * yy  +  $moshier.epsilon.coseps * zz;

	yy = $util.zatan2( x, y );
	zz = Math.asin( z / r );

	// longitude and latitude in decimal
	polar[0] = yy;
	polar[1] = zz;
	polar[2] = r;

	// longitude and latitude in h,m,s
	polar [3] = $util.dms (polar[0]);
	polar [4] = $util.dms (polar[1]);

	result [0] = polar [0];
	result [1] = polar [1];
	result [2] = polar [2];
	result [3] = polar [3];
	result [4] = polar [4];

	return result;
};
// gplan.js
$ns.gplan = {
	/* From Simon et al (1994)  */
	freqs: [
		/* Arc sec per 10000 Julian years.  */
		53810162868.8982,
		21066413643.3548,
		12959774228.3429,
		6890507749.3988,
		1092566037.7991,
		439960985.5372,
		154248119.3933,
		78655032.0744,
		52272245.1795
	],

	phases: [
		/* Arc sec.  */
		252.25090552 * 3600.,
		181.97980085 * 3600.,
		100.46645683 * 3600.,
		355.43299958 * 3600.,
		34.35151874 * 3600.,
		50.07744430 * 3600.,
		314.05500511 * 3600.,
		304.34866548 * 3600.,
		860492.1546
	],

	ss: [],
	cc: [],

	Args: [],
	LP_equinox: 0,
	NF_arcsec: 0,
	Ea_arcsec: 0,
	pA_precession: 0

};

/*
 Routines to chew through tables of perturbations.
*/
$ns.gplan.calc = function (date, body_ptable, polar) {
	var su, cu, sv, cv, T; // double
	var t, sl, sb, sr; // double
	var i, j, k, m, n, k1, ip, np, nt; // int
	var p; // char array
	var pl; // double array
	var pb; // double array
	var pr; // double array

	T = (date.julian - $const.j2000) / body_ptable.timescale;
	n = body_ptable.maxargs;
	/* Calculate sin( i*MM ), etc. for needed multiple angles.  */
	for (i = 0; i < n; i++) {
		if ((j = body_ptable.max_harmonic[i]) > 0)
		{
			sr = ($util.mods3600 (this.freqs [i] * T) + this.phases [i]) * $const.STR;
			this.sscc (i, sr, j);
		}
	}

	/* Point to start of table of arguments. */
	p = body_ptable.arg_tbl;

	/* Point to tabulated cosine and sine amplitudes.  */
	pl = body_ptable.lon_tbl;
	pb = body_ptable.lat_tbl;
	pr = body_ptable.rad_tbl;

	sl = 0.0;
	sb = 0.0;
	sr = 0.0;

	var p_i = 0;
	var pl_i = 0;
	var pb_i = 0;
	var pr_i = 0;

	for (;;) {
		/* argument of sine and cosine */
		/* Number of periodic arguments. */
		np = p [p_i ++]; // np = *p++
		if (np < 0) {
			break;
		}
		if (np == 0) { /* It is a polynomial term.  */
			nt = p [p_i ++]; // nt = *p++
			/* Longitude polynomial. */
			cu = pl [pl_i ++]; // cu = *pl++;
			for (ip = 0; ip < nt; ip ++) {
				cu = cu * T + pl [pl_i ++]; //*pl++;
			}
			sl +=  $util.mods3600 (cu);
			/* Latitude polynomial. */
			cu = pb [pb_i ++];//*pb++;
			for (ip = 0; ip < nt; ip++)
			{
				cu = cu * T + pb [pb_i ++]; //*pb++;
			}
			sb += cu;
			/* Radius polynomial. */
			cu = pr [pr_i ++]; //*pr++;
			for (ip = 0; ip < nt; ip++)
			{
				cu = cu * T + pr [pr_i ++]; //*pr++;
			}
			sr += cu;
			continue;
		}
		k1 = 0;
		cv = 0.0;
		sv = 0.0;
		for (ip = 0; ip < np; ip++)
		{
			/* What harmonic.  */
			j = p [p_i ++]; //*p++;
			/* Which planet.  */
			m = p [p_i ++] - 1; // *p++ - 1
			if (j)
			{
				k = j;
				if (j < 0)
					k = -k;
				k -= 1;
				su = this.ss[m][k];	/* sin(k*angle) */
				if (j < 0)
					su = -su;
				cu = this.cc[m][k];
				if (k1 == 0)
				{		/* set first angle */
					sv = su;
					cv = cu;
					k1 = 1;
				}
				else
				{		/* combine angles */
					t = su * cv + cu * sv;
					cv = cu * cv - su * sv;
					sv = t;
				}
			}
		}
		/* Highest power of T.  */
		nt = p [p_i ++]; //*p++;
		/* Longitude. */
		cu = pl [pl_i ++]; //*pl++;
		su = pl [pl_i ++]; //*pl++;
		for (ip = 0; ip < nt; ip++)
		{
			cu = cu * T + pl [pl_i ++]; //*pl++;
			su = su * T + pl [pl_i ++]; //*pl++;
		}
		sl += cu * cv + su * sv;
		/* Latitiude. */
		cu = pb [pb_i ++]; //*pb++;
		su = pb [pb_i ++]; //*pb++;
		for (ip = 0; ip < nt; ip++)
		{
			cu = cu * T + pb [pb_i ++]; //*pb++;
			su = su * T + pb [pb_i ++]; //*pb++;
		}
		sb += cu * cv + su * sv;
		/* Radius. */
		cu = pr [pr_i ++]; //*pr++;
		su = pr [pr_i ++]; //*pr++;
		for (ip = 0; ip < nt; ip++)
		{
			cu = cu * T + pr [pr_i ++]; //*pr++;
			su = su * T + pr [pr_i ++]; //*pr++;
		}
		sr += cu * cv + su * sv;
	}

	polar [0] = $const.STR * sl;
	polar [1] = $const.STR * sb;
	polar [2] = $const.STR * body_ptable.distance * sr + body_ptable.distance;
};

/* Prepare lookup table of sin and cos ( i*Lj )
 * for required multiple angles
 */
$ns.gplan.sscc = function (k, arg, n) {
	var cu, su, cv, sv, s; // double
	var i; // int

	su = Math.sin (arg);
	cu = Math.cos (arg);
	this.ss[k] = [];
	this.cc[k] = [];

	this.ss[k][0] = su;		/* sin(L) */
	this.cc[k][0] = cu;		/* cos(L) */
	sv = 2.0 * su * cu;
	cv = cu * cu - su * su;
	this.ss[k][1] = sv;		/* sin(2L) */
	this.cc[k][1] = cv;
	for (i = 2; i < n; i++)
	{
		s = su * cv + cu * sv;
		cv = cu * cv - su * sv;
		sv = s;
		this.ss[k][i] = sv;		/* sin( i+1 L ) */
		this.cc[k][i] = cv;
	}
};

/* Compute mean elements at Julian date J.  */
$ns.gplan.meanElements = function (date) {
	var x, T, T2; // double

	/* Time variables.  T is in Julian centuries.  */
	T = (date.julian - 2451545.0) / 36525.0;
	T2 = T * T;

	/* Mean longitudes of planets (Simon et al, 1994)
	 .047" subtracted from constant term for offset to DE403 origin. */

	/* Mercury */
	x = $util.mods3600( 538101628.6889819 * T + 908103.213 );
	x += (6.39e-6 * T
		- 0.0192789) * T2;
	this.Args[0] = $const.STR * x;

	/* Venus */
	x = $util.mods3600( 210664136.4335482 * T + 655127.236 );
	x += (-6.27e-6  * T
		+ 0.0059381) * T2;
	this.Args[1] = $const.STR * x;

	/* Earth  */
	x = $util.mods3600( 129597742.283429 * T + 361679.198 );
	x += (-5.23e-6 * T
		- 2.04411e-2 ) * T2;
	this.Ea_arcsec = x;
	this.Args[2] = $const.STR * x;

	/* Mars */
	x = $util.mods3600(  68905077.493988 * T +  1279558.751 );
	x += (-1.043e-5 * T
		+ 0.0094264) * T2;
	this.Args[3] = $const.STR * x;

	/* Jupiter */
	x = $util.mods3600( 10925660.377991 * T + 123665.420 );
	x += ((((-3.4e-10 * T
		+ 5.91e-8) * T
		+ 4.667e-6) * T
		+ 5.706e-5) * T
		- 3.060378e-1)*T2;
	this.Args[4] = $const.STR * x;

	/* Saturn */
	x = $util.mods3600( 4399609.855372 * T + 180278.752 );
	x += (((( 8.3e-10 * T
		- 1.452e-7) * T
		- 1.1484e-5) * T
		- 1.6618e-4) * T
		+ 7.561614E-1)*T2;
	this.Args[5] = $const.STR * x;

	/* Uranus */
	x = $util.mods3600( 1542481.193933 * T + 1130597.971 )
		+ (0.00002156*T - 0.0175083)*T2;
	this.Args[6] = $const.STR * x;

	/* Neptune */
	x = $util.mods3600( 786550.320744 * T + 1095655.149 )
		+ (-0.00000895*T + 0.0021103)*T2;
	this.Args[7] = $const.STR * x;

	/* Copied from cmoon.c, DE404 version.  */
	/* Mean elongation of moon = D */
	x = $util.mods3600( 1.6029616009939659e+09 * T + 1.0722612202445078e+06 );
	x += (((((-3.207663637426e-013 * T
		+ 2.555243317839e-011) * T
		+ 2.560078201452e-009) * T
		- 3.702060118571e-005) * T
		+ 6.9492746836058421e-03) * T /* D, t^3 */
		- 6.7352202374457519e+00) * T2; /* D, t^2 */
	this.Args[9] = $const.STR * x;

	/* Mean distance of moon from its ascending node = F */
	x = $util.mods3600( 1.7395272628437717e+09 * T + 3.3577951412884740e+05 );
	x += ((((( 4.474984866301e-013 * T
		+ 4.189032191814e-011) * T
		- 2.790392351314e-009) * T
		- 2.165750777942e-006) * T
		- 7.5311878482337989e-04) * T /* F, t^3 */
		- 1.3117809789650071e+01) * T2; /* F, t^2 */
	this.NF_arcsec = x;
	this.Args[10] = $const.STR * x;

	/* Mean anomaly of sun = l' (J. Laskar) */
	x = $util.mods3600(1.2959658102304320e+08 * T + 1.2871027407441526e+06);
	x += ((((((((
		1.62e-20 * T
			- 1.0390e-17 ) * T
		- 3.83508e-15 ) * T
		+ 4.237343e-13 ) * T
		+ 8.8555011e-11 ) * T
		- 4.77258489e-8 ) * T
		- 1.1297037031e-5 ) * T
		+ 8.7473717367324703e-05) * T
		- 5.5281306421783094e-01) * T2;
	this.Args[11] = $const.STR * x;

	/* Mean anomaly of moon = l */
	x = $util.mods3600( 1.7179159228846793e+09 * T + 4.8586817465825332e+05 );
	x += (((((-1.755312760154e-012 * T
		+ 3.452144225877e-011) * T
		- 2.506365935364e-008) * T
		- 2.536291235258e-004) * T
		+ 5.2099641302735818e-02) * T /* l, t^3 */
		+ 3.1501359071894147e+01) * T2; /* l, t^2 */
	this.Args[12] = $const.STR * x;

	/* Mean longitude of moon, re mean ecliptic and equinox of date = L  */
	x = $util.mods3600( 1.7325643720442266e+09 * T + 7.8593980921052420e+05);
	x += ((((( 7.200592540556e-014 * T
		+ 2.235210987108e-010) * T
		- 1.024222633731e-008) * T
		- 6.073960534117e-005) * T
		+ 6.9017248528380490e-03) * T /* L, t^3 */
		- 5.6550460027471399e+00) * T2; /* L, t^2 */
	this.LP_equinox = x;
	this.Args[13] = $const.STR * x;

	/* Precession of the equinox  */
	x = ((((((((( -8.66e-20*T - 4.759e-17)*T
		+ 2.424e-15)*T
		+ 1.3095e-12)*T
		+ 1.7451e-10)*T
		- 1.8055e-8)*T
		- 0.0000235316)*T
		+ 0.000076)*T
		+ 1.105414)*T
		+ 5028.791959)*T;
	/* Moon's longitude re fixed J2000 equinox.  */
	/*
	 Args[13] -= x;
	 */
	this.pA_precession = $const.STR * x;

	/* Free librations.  */
	/* longitudinal libration 2.891725 years */
	x = $util.mods3600( 4.48175409e7 * T + 8.060457e5 );
	this.Args[14] = $const.STR * x;
	/* libration P, 24.2 years */
	x = $util.mods3600(  5.36486787e6 * T - 391702.8 );
	this.Args[15] = $const.STR * x;

	/* libration W, 74.7 years. */
	x = $util.mods3600( 1.73573e6 * T );
	this.Args[17] = $const.STR * x;
};


/* Generic program to accumulate sum of trigonometric series
 in three variables (e.g., longitude, latitude, radius)
 of the same list of arguments.  */
$ns.gplan.calc3 = function (date, body_ptable, polar, body_number) {
	var i, j, k, m, n, k1, ip, np, nt; // int
	var p; // int array
	var pl; // double array
	var pb; // double array
	var pr; // double array

	var su, cu, sv, cv; // double
	var T, t, sl, sb, sr; // double

	this.meanElements (date);

	T = (date.julian - $const.j2000) / body_ptable.timescale;
	n = body_ptable.maxargs;
	/* Calculate sin( i*MM ), etc. for needed multiple angles.  */
	for (i = 0; i < n; i++)
	{
		if ((j = body_ptable.max_harmonic [i]) > 0)
		{
			this.sscc (i, this.Args [i], j);
		}
	}

	/* Point to start of table of arguments. */
	p = body_ptable.arg_tbl;
	/* Point to tabulated cosine and sine amplitudes.  */
	pl = body_ptable.lon_tbl;
	pb = body_ptable.lat_tbl;
	pr = body_ptable.rad_tbl;

	sl = 0.0;
	sb = 0.0;
	sr = 0.0;

	var p_i = 0;
	var pl_i = 0;
	var pb_i = 0;
	var pr_i = 0;

	for (;;)
	{
		/* argument of sine and cosine */
		/* Number of periodic arguments. */
		np = p [p_i ++]; //*p++;
		if (np < 0)
			break;
		if (np == 0)
		{			/* It is a polynomial term.  */
			nt = p [p_i ++]; //*p++;
			/* "Longitude" polynomial (phi). */
			cu = pl [pl_i ++]; //*pl++;
			for (ip = 0; ip < nt; ip++)
			{
				cu = cu * T + pl [pl_i ++]; //*pl++;
			}
			/*	  sl +=  mods3600 (cu); */
			sl += cu;
			/* "Latitude" polynomial (theta). */
			cu = pb [pb_i ++]; //*pb++;
			for (ip = 0; ip < nt; ip++)
			{
				cu = cu * T + pb [pb_i ++]; //*pb++;
			}
			sb += cu;
			/* Radius polynomial (psi). */
			cu = pr [pr_i ++]; //*pr++;
			for (ip = 0; ip < nt; ip++)
			{
				cu = cu * T + pr [pr_i ++]; //*pr++;
			}
			sr += cu;
			continue;
		}
		k1 = 0;
		cv = 0.0;
		sv = 0.0;
		for (ip = 0; ip < np; ip++) {
			/* What harmonic.  */
			j = p [p_i ++]; //*p++;
			/* Which planet.  */
			m = p [p_i ++] - 1; //*p++ - 1;
			if (j) {
				/*	      k = abs (j); */
				if (j < 0)
					k = -j;
				else
					k = j;
				k -= 1;
				su = this.ss[m][k];	/* sin(k*angle) */
				if (j < 0)
					su = -su;
				cu = this.cc[m][k];
				if (k1 == 0)
				{		/* set first angle */
					sv = su;
					cv = cu;
					k1 = 1;
				}
				else
				{		/* combine angles */
					t = su * cv + cu * sv;
					cv = cu * cv - su * sv;
					sv = t;
				}
			}
		}
		/* Highest power of T.  */
		nt = p [p_i ++]; //*p++;
		/* Longitude. */
		cu = pl [pl_i ++]; //*pl++;
		su = pl [pl_i ++]; //*pl++;
		for (ip = 0; ip < nt; ip++) {
			cu = cu * T + pl [pl_i ++]; //*pl++;
			su = su * T + pl [pl_i ++]; //*pl++;
		}
		sl += cu * cv + su * sv;
		/* Latitiude. */
		cu = pb [pb_i ++]; //*pb++;
		su = pb [pb_i ++]; //*pb++;
		for (ip = 0; ip < nt; ip++)
		{
			cu = cu * T + pb [pb_i ++]; //*pb++;
			su = su * T + pb [pb_i ++]; //*pb++;
		}
		sb += cu * cv + su * sv;
		/* Radius. */
		cu = pr [pr_i ++]; //*pr++;
		su = pr [pr_i ++]; //*pr++;
		for (ip = 0; ip < nt; ip++)
		{
			cu = cu * T + pr [pr_i ++]; //*pr++;
			su = su * T + pr [pr_i ++]; //*pr++;
		}
		sr += cu * cv + su * sv;
	}
	t = body_ptable.trunclvl;
	polar[0] = this.Args[body_number - 1] + $const.STR * t * sl;
	polar[1] = $const.STR * t * sb;
	polar[2] = body_ptable.distance * (1.0 + $const.STR * t * sr);
};

/* Generic program to accumulate sum of trigonometric series
 in two variables (e.g., longitude, radius)
 of the same list of arguments.  */
$ns.gplan.calc2 = function (date, body_ptable, polar) {
	var i, j, k, m, n, k1, ip, np, nt; // int
	var p; // int array
	var pl; // double array
	var pr; // double array

	var su, cu, sv, cv; // double
	var T, t, sl, sr; // double

	this.meanElements (date);

	T = (date.julian - $const.j2000) / body_ptable.timescale;
	n = body_ptable.maxargs;
	/* Calculate sin( i*MM ), etc. for needed multiple angles.  */
	for (i = 0; i < n; i++)
	{
		if ((j = body_ptable.max_harmonic[i]) > 0)
		{
			this.sscc (i, this.Args[i], j);
		}
	}

	/* Point to start of table of arguments. */
	p = body_ptable.arg_tbl;
	/* Point to tabulated cosine and sine amplitudes.  */
	pl = body_ptable.lon_tbl;
	pr = body_ptable.rad_tbl;

	var p_i = 0;
	var pl_i = 0;
	var pr_i = 0;

	sl = 0.0;
	sr = 0.0;

	for (;;)
	{
		/* argument of sine and cosine */
		/* Number of periodic arguments. */
		np = p [p_i ++]; //*p++;
		if (np < 0)
			break;
		if (np == 0)
		{			/* It is a polynomial term.  */
			nt = p [p_i ++]; //*p++;
			/* Longitude polynomial. */
			cu = pl [pl_i ++]; //*pl++;
			for (ip = 0; ip < nt; ip++)
			{
				cu = cu * T + pl [pl_i ++]; //*pl++;
			}
			/*	  sl +=  mods3600 (cu); */
			sl += cu;
			/* Radius polynomial. */
			cu = pr [pr_i ++]; //*pr++;
			for (ip = 0; ip < nt; ip++)
			{
				cu = cu * T + pr [pr_i ++]; //*pr++;
			}
			sr += cu;
			continue;
		}
		k1 = 0;
		cv = 0.0;
		sv = 0.0;
		for (ip = 0; ip < np; ip++)
		{
			/* What harmonic.  */
			j = p [p_i ++]; //*p++;
			/* Which planet.  */
			m = p [p_i ++] - 1; //*p++ - 1;
			if (j)
			{
				/*	      k = abs (j); */
				if (j < 0)
					k = -j;
				else
					k = j;
				k -= 1;
				su = this.ss[m][k];	/* sin(k*angle) */
				if (j < 0)
					su = -su;
				cu = this.cc[m][k];
				if (k1 == 0)
				{		/* set first angle */
					sv = su;
					cv = cu;
					k1 = 1;
				}
				else
				{		/* combine angles */
					t = su * cv + cu * sv;
					cv = cu * cv - su * sv;
					sv = t;
				}
			}
		}
		/* Highest power of T.  */
		nt = p [p_i ++]; //*p++;
		/* Longitude. */
		cu = pl [pl_i ++]; //*pl++;
		su = pl [pl_i ++]; //*pl++;
		for (ip = 0; ip < nt; ip++)
		{
			cu = cu * T + pl [pl_i ++]; //*pl++;
			su = su * T + pl [pl_i ++]; //*pl++;
		}
		sl += cu * cv + su * sv;
		/* Radius. */
		cu = pr [pr_i ++]; //*pr++;
		su = pr [pr_i ++]; //*pr++;
		for (ip = 0; ip < nt; ip++)
		{
			cu = cu * T + pr [pr_i ++]; //*pr++;
			su = su * T + pr [pr_i ++]; //*pr++;
		}
		sr += cu * cv + su * sv;
	}
	t = body_ptable.trunclvl;
	polar[0] = t * sl;
	polar[2] = t * sr;
};

/* Generic program to accumulate sum of trigonometric series
 in one variable.  */
$ns.gplan.calc1 = function (date, body_ptable) {
	var i, j, k, m, k1, ip, np, nt; // int
	var p; // int array
	var pl; // double array

	var su, cu, sv, cv; // double
	var T, t, sl; // double

	T = (date.julian - $const.j2000) / body_ptable.timescale;
	this.meanElements (date);
	/* Calculate sin( i*MM ), etc. for needed multiple angles.  */
	for (i = 0; i < this.Args.length; i++)
	{
		if ((j = body_ptable.max_harmonic[i]) > 0)
		{
			this.sscc (i, this.Args[i], j);
		}
	}

	/* Point to start of table of arguments. */
	p = body_ptable.arg_tbl;
	/* Point to tabulated cosine and sine amplitudes.  */
	pl = body_ptable.lon_tbl;

	sl = 0.0;

	var p_i = 0;
	var pl_i = 0;

	for (;;) {
		/* argument of sine and cosine */
		/* Number of periodic arguments. */
		np = p [p_i ++]; //*p++;
		if (np < 0)
			break;
		if (np == 0)
		{			/* It is a polynomial term.  */
			nt = p [p_i ++]; //*p++;
			cu = pl [pl_i ++]; //*pl++;
			for (ip = 0; ip < nt; ip++)
			{
				cu = cu * T + pl [pl_i ++]; //*pl++;
			}
			/*	  sl +=  mods3600 (cu); */
			sl += cu;
			continue;
		}
		k1 = 0;
		cv = 0.0;
		sv = 0.0;
		for (ip = 0; ip < np; ip++)
		{
			/* What harmonic.  */
			j = p [p_i ++]; //*p++;
			/* Which planet.  */
			m = p [p_i ++] - 1; //*p++ - 1;
			if (j)
			{
				/*	      k = abs (j); */
				if (j < 0)
					k = -j;
				else
					k = j;
				k -= 1;
				su = this.ss[m][k];	/* sin(k*angle) */
				if (j < 0)
					su = -su;
				cu = this.cc[m][k];
				if (k1 == 0)
				{		/* set first angle */
					sv = su;
					cv = cu;
					k1 = 1;
				}
				else
				{		/* combine angles */
					t = su * cv + cu * sv;
					cv = cu * cv - su * sv;
					sv = t;
				}
			}
		}
		/* Highest power of T.  */
		nt = p [p_i ++]; //*p++;
		/* Cosine and sine coefficients.  */
		cu = pl [pl_i ++]; //*pl++;
		su = pl [pl_i ++]; //*pl++;
		for (ip = 0; ip < nt; ip++)
		{
			cu = cu * T + pl [pl_i ++]; //*pl++;
			su = su * T + pl [pl_i ++]; //*pl++;
		}
		sl += cu * cv + su * sv;
	}
	return body_ptable.trunclvl * sl;
};

/* Compute geocentric moon.  */
$ns.gplan.moon = function (date, rect, pol) {
	var x, cosB, sinB, cosL, sinL; // double

	this.calc2 (date, $moshier.plan404.moonlr, pol);
	x = pol[0];
	x += this.LP_equinox;
	if (x < -6.48e5) {
		x += 1.296e6;
	}
	if (x > 6.48e5) {
		x -= 1.296e6;
	}
	pol[0] = $const.STR * x;
	x = this.calc1 (date, $moshier.plan404.moonlat);
	pol[1] = $const.STR * x;
	x = (1.0 + $const.STR * pol[2]) * $moshier.plan404.moonlr.distance;
	pol[2] = x;
	/* Convert ecliptic polar to equatorial rectangular coordinates.  */
	$moshier.epsilon.calc (date);
	cosB = Math.cos(pol[1]);
	sinB = Math.sin(pol[1]);
	cosL = Math.cos(pol[0]);
	sinL = Math.sin(pol[0]);
	rect[0] = cosB * cosL * x;
	rect[1] = ($moshier.epsilon.coseps * cosB * sinL - $moshier.epsilon.sineps * sinB) * x;
	rect[2] = ($moshier.epsilon.sineps * cosB * sinL + $moshier.epsilon.coseps * sinB) * x;
};

// precess.js
$ns.precess = {
	/* In WILLIAMS and SIMON, Laskar's terms of order higher than t^4
	 have been retained, because Simon et al mention that the solution
	 is the same except for the lower order terms.  */
	pAcof: [
		/* Corrections to Williams (1994) introduced in DE403.  */
		-8.66e-10, -4.759e-8, 2.424e-7, 1.3095e-5, 1.7451e-4, -1.8055e-3,
		-0.235316, 0.076, 110.5414, 50287.91959
	],
	/* Pi from Williams' 1994 paper, in radians.  No change in DE403.  */
	nodecof: [
		6.6402e-16, -2.69151e-15, -1.547021e-12, 7.521313e-12, 1.9e-10,
		-3.54e-9, -1.8103e-7,  1.26e-7,  7.436169e-5,
		-0.04207794833,  3.052115282424
	],
	/* pi from Williams' 1994 paper, in radians.  No change in DE403.  */
	inclcof: [
		1.2147e-16, 7.3759e-17, -8.26287e-14, 2.503410e-13, 2.4650839e-11,
		-5.4000441e-11, 1.32115526e-9, -6.012e-7, -1.62442e-5,
		0.00227850649, 0.0
	]
};

/* Precession of the equinox and ecliptic
 * from epoch Julian date J to or from J2000.0
 *
 * Subroutine arguments:
 *
 * R = rectangular equatorial coordinate vector to be precessed.
 *     The result is written back into the input vector.
 * J = Julian date
 * direction =
 *      Precess from J to J2000: direction = 1
 *      Precess from J2000 to J: direction = -1
 * Note that if you want to precess from J1 to J2, you would
 * first go from J1 to J2000, then call the program again
 * to go from J2000 to J2.
 */
$ns.precess.calc = function (R, date, direction) {
	var A, B, T, pA, W, z; // double
	var x = []; // double
	var p; // double array
	var p_i = 0;
	var i; // int

	if( date.julian == $const.j2000 ) {
		return;
	}
	/* Each precession angle is specified by a polynomial in
	 * T = Julian centuries from J2000.0.  See AA page B18.
	 */
	T = (date.julian - $const.j2000) / 36525.0;

	/* Implementation by elementary rotations using Laskar's expansions.
	 * First rotate about the x axis from the initial equator
	 * to the ecliptic. (The input is equatorial.)
	 */
	if (direction == 1) {
		$moshier.epsilon.calc (date); /* To J2000 */
	} else {
		$moshier.epsilon.calc ({julian: $const.j2000}); /* From J2000 */
	}
	x[0] = R[0];
	z = $moshier.epsilon.coseps*R[1] + $moshier.epsilon.sineps*R[2];
	x[2] = -$moshier.epsilon.sineps*R[1] + $moshier.epsilon.coseps*R[2];
	x[1] = z;

	/* Precession in longitude
	 */
	T /= 10.0; /* thousands of years */
	p = this.pAcof;
	pA = p [p_i ++]; //*p++;
	for( i=0; i<9; i++ ) {
		pA = pA * T + p [p_i ++]; //*p++;
	}
	pA *= $const.STR * T;

	/* Node of the moving ecliptic on the J2000 ecliptic.
	 */
	p = this.nodecof;
	p_i = 0;
	W = p [p_i ++]; //*p++;
	for( i=0; i<10; i++ ) {
		W = W * T + p [p_i ++]; //*p++;
	}

	/* Rotate about z axis to the node.
	 */
	if( direction == 1 ) {
		z = W + pA;
	} else {
		z = W;
	}
	B = Math.cos(z);
	A = Math.sin(z);
	z = B * x[0] + A * x[1];
	x[1] = -A * x[0] + B * x[1];
	x[0] = z;

	/* Rotate about new x axis by the inclination of the moving
	 * ecliptic on the J2000 ecliptic.
	 */
	p = this.inclcof;
	p_i = 0;
	z = p [p_i ++]; //*p++;
	for( i=0; i<10; i++ ) {
		z = z * T + p [p_i ++]; //*p++;
	}
	if( direction == 1 ) {
		z = -z;
	}
	B = Math.cos(z);
	A = Math.sin(z);
	z = B * x[1] + A * x[2];
	x[2] = -A * x[1] + B * x[2];
	x[1] = z;

	/* Rotate about new z axis back from the node.
	 */
	if( direction == 1 ) {
		z = -W;
	} else {
		z = -W - pA;
	}
	B = Math.cos(z);
	A = Math.sin(z);
	z = B * x[0] + A * x[1];
	x[1] = -A * x[0] + B * x[1];
	x[0] = z;

	/* Rotate about x axis to final equator.
	 */
	if( direction == 1 ) {
		$moshier.epsilon.calc ({julian: $const.j2000});
	} else {
		$moshier.epsilon.calc ( date );
	}
	z = $moshier.epsilon.coseps * x[1] - $moshier.epsilon.sineps * x[2];
	x[2] = $moshier.epsilon.sineps * x[1] + $moshier.epsilon.coseps * x[2];
	x[1] = z;

	for( i=0; i<3; i++ ) {
		R[i] = x[i];
	}
};
// util.js
$ns.util = {};

$ns.util.mods3600 = function (value) {
	var result;

	result = (value - 1.296e6 * Math.floor (value / 1.296e6));

	return result;
};

/* Reduce x modulo 2 pi
 */
$ns.util.modtp = function (x) {
	var y; // double

	y = Math.floor ( x / $const.TPI );
	y = x - y * $const.TPI;
	while( y < 0.0 ) {
		y += $const.TPI;
	}
	while( y >= $const.TPI ) {
		y -= $const.TPI;
	}
	return y;
};

/* Reduce x modulo 360 degrees
 */
$ns.util.mod360 = function (x) {
	var k; // int
	var y; // double

	k = Math.floor (x / 360.0);
	y = x  -  k * 360.0;
	while( y < 0.0 ) {
		y += 360.0;
	}
	while( y > 360.0 ) {
		y -= 360.0;
	}
	return y;
};

/* Reduce x modulo 30 degrees
 */
$ns.util.mod30 = function (x) {
	var k; // int
	var y; // double

	k = Math.floor (x / 30.0);
	y = x  -  k * 30.0;
	while( y < 0.0 ) {
		y += 30.0;
	}
	while( y > 30.0 ) {
		y -= 30.0;
	}
	return y;
};

$ns.util.zatan2 = function ( x, y ) {
	var z, w; // double
	var code; // short

	code = 0;

	if( x < 0.0 ) {
		code = 2;
	}
	if( y < 0.0 ) {
		code |= 1;
	}

	if( x == 0.0 ) {
		if( code & 1 ) {
			return 1.5 * Math.PI ;
		}
		if( y == 0.0 ) {
			return  0.0;
		}
		return 0.5 * Math.PI;
	}

	if( y == 0.0 ) {
		if( code & 2 ) {
			return Math.PI;
		}
		return 0.0;
	}

	switch( code ) {
		default:
		case 0: w = 0.0; break;
		case 1: w = 2.0 * Math.PI; break;
		case 2:
		case 3: w = Math.PI; break;
	}

	z = Math.atan (y / x);

	return w + z;
};

$ns.util.sinh = function (x) {
	return (Math.exp(x) - Math.exp(-x)) / 2;
};

$ns.util.cosh = function (x) {
	return (Math.exp(x) + Math.exp(-x)) / 2;
};

$ns.util.tanh = function (x) {
	return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
};

$ns.util.hms = function (x) {
	var h, m; // int
	var sint, sfrac; // long
	var s; // double
	var result = {};

	s = x * $const.RTOH;
	if (s < 0.0) {
		s += 24.0;
	}
	h = Math.floor (s);
	s -= h;
	s *= 60;
	m = Math.floor (s);
	s -= m;
	s *= 60;
	/* Handle shillings and pence roundoff. */
	sfrac = Math.floor (1000.0 * s + 0.5);
	if ( sfrac >= 60000 ) {
		sfrac -= 60000;
		m += 1;
		if( m >= 60 ) {
			m -= 60;
			h += 1;
		}
	}
	sint = Math.floor (sfrac / 1000);
	sfrac -= Math.floor (sint * 1000);

	result.hours = h;
	result.minutes = m;
	result.seconds = sint;
	result.milliseconds = sfrac;

	return result;
};

$ns.util.dms = function (x) {
	var s; // double
	var d, m; // int
	var result = {};

	s = x * $const.RTD;
	if( s < 0.0 ) {
		s = -s;
	}
	d = Math.floor (s);
	s -= d;
	s *= 60;
	m = Math.floor (s);
	s -= m;
	s *= 60;

	result.degree = d;
	result.minutes = m;
	result.seconds = s;

	return result;
};

/* Display magnitude of correction vector
 * in arc seconds
 */
$ns.util.showcor = function (p, dp, result) {
	var p1 = []; // dr, dd; // double
	var i; // int
	var d;

	for( i=0; i<3; i++ ) {
		p1[i] = p[i] + dp[i];
	}

	d = $util.deltap ( p, p1);

	result = result || {};
	result.dRA = $const.RTS * d.dr/15.0;
	result.dDec = $const.RTS * d.dd;

	return result;
};

/* Display Right Ascension and Declination
 * from input equatorial rectangular unit vector.
 * Output vector pol[] contains R.A., Dec., and radius.
 */
$ns.util.showrd = function (p, pol, result) {
	var x, y, r; // double
	var i; // int

	r = 0.0;
	for( i=0; i<3; i++ ) {
		x = p[i];
		r += x * x;
	}
	r = Math.sqrt(r);

	x = $util.zatan2( p[0], p[1] );
	pol[0] = x;

	y = Math.asin( p[2]/r );
	pol[1] = y;

	pol[2] = r;

	result = result || {};

	$copy (result, {
		dRA: x,
		dDec: y,
		ra: $util.hms (x),
		dec: $util.dms (y)
	});

	return result;
};

/*
 * Convert change in rectangular coordinatates to change
 * in right ascension and declination.
 * For changes greater than about 0.1 degree, the
 * coordinates are converted directly to R.A. and Dec.
 * and the results subtracted.  For small changes,
 * the change is calculated to first order by differentiating
 *   tan(R.A.) = y/x
 * to obtain
 *    dR.A./cos**2(R.A.) = dy/x  -  y dx/x**2
 * where
 *    cos**2(R.A.)  =  1/(1 + (y/x)**2).
 *
 * The change in declination arcsin(z/R) is
 *   d asin(u) = du/sqrt(1-u**2)
 *   where u = z/R.
 *
 * p0 is the initial object - earth vector and
 * p1 is the vector after motion or aberration.
 *
 */
$ns.util.deltap = function (p0, p1, d) {
	var dp = [], A, B, P, Q, x, y, z; // double
	var i; // int

	d = d || {};

	P = 0.0;
	Q = 0.0;
	z = 0.0;
	for( i=0; i<3; i++ ) {
		x = p0[i];
		y = p1[i];
		P += x * x;
		Q += y * y;
		y = y - x;
		dp[i] = y;
		z += y*y;
	}

	A = Math.sqrt(P);
	B = Math.sqrt(Q);

	if( (A < 1.e-7) || (B < 1.e-7) || (z/(P+Q)) > 5.e-7 ) {
		P = $util.zatan2( p0[0], p0[1] );
		Q = $util.zatan2( p1[0], p1[1] );
		Q = Q - P;
		while( Q < -Math.PI ) {
			Q += 2.0*Math.PI;
		}
		while( Q > Math.PI ) {
			Q -= 2.0*Math.PI;
		}
		d.dr = Q;
		P = Math.asin( p0[2]/A );
		Q = Math.asin( p1[2]/B );
		d.dd = Q - P;
		return d;
	}


	x = p0[0];
	y = p0[1];
	if( x == 0.0 ) {
		d.dr = 1.0e38;
	} else {
		Q = y/x;
		Q = (dp[1]  -  dp[0]*y/x)/(x * (1.0 + Q*Q));
		d.dr = Q;
	}

	x = p0[2] / A;
	P = Math.sqrt( 1.0 - x*x );
	d.dd = (p1[2] / B - x) / P;

	return d;
};

/* Sun - object - earth angles and distances.
 * q (object), e (earth), and p (q minus e) are input vectors.
 * The answers are posted in the following global locations:
 */
$ns.util.angles = function (p, q, e) {
	var a, b, s; // double
	var i; // int

	$const.EO = 0.0;
	$const.SE = 0.0;
	$const.SO = 0.0;
	$const.pq = 0.0;
	$const.ep = 0.0;
	$const.qe = 0.0;
	for( i=0; i<3; i++ ) {
		a = e[i];
		b = q[i];
		s = p[i];
		$const.EO += s * s;
		$const.SE += a * a;
		$const.SO += b * b;
		$const.pq += s * b;
		$const.ep += a * s;
		$const.qe += b * a;
	}
	$const.EO = Math.sqrt($const.EO); /* Distance between Earth and object */
	$const.SO = Math.sqrt($const.SO); /* Sun - object */
	$const.SE = Math.sqrt($const.SE); /* Sun - earth */
	/* Avoid fatality: if object equals sun, SO is zero.  */
	if( $const.SO > 1.0e-12 )
	{
		$const.pq /= $const.EO*$const.SO;	/* cosine of sun-object-earth */
		$const.qe /= $const.SO*$const.SE;	/* cosine of earth-sun-object */
	}
	$const.ep /= $const.SE*$const.EO;	/* -cosine of sun-earth-object */
};
// kepler.js
$ns.kepler = {};

$ns.kepler.calc = function (date, body, rect, polar) {
	var alat, E, M, W, temp; // double
	var epoch, inclination, ascnode, argperih; // double
	var meandistance, dailymotion, eccent, meananomaly; // double
	var r, coso, sino, cosa; // double

	rect = rect || [];
	polar = polar || [];

	/* Call program to compute position, if one is supplied.  */
	if ( body.ptable ) {
		if ( body.key == 'earth' ) {
			$moshier.gplan.calc3 (date, body.ptable, polar, 3);
		} else {
			$moshier.gplan.calc (date, body.ptable, polar);
		}
		E = polar[0]; /* longitude */
		body.longitude = E;
		W = polar[1]; /* latitude */
		r = polar[2]; /* radius */
		body.distance = r;
		body.epoch = date.julian;
		body.equinox = {julian: $const.j2000};
		// goto kepdon;
	} else {
		/* Decant the parameters from the data structure
		 */
		epoch = body.epoch;
		inclination = body.inclination;
		ascnode = body.node * $const.DTR;
		argperih = body.perihelion;
		meandistance = body.semiAxis; /* semimajor axis */
		dailymotion = body.dailyMotion;
		eccent = body.eccentricity;
		meananomaly = body.anomaly;
		/* Check for parabolic orbit. */
		if( eccent == 1.0 ) {
			/* meandistance = perihelion distance, q
			 * epoch = perihelion passage date
			 */
			temp = meandistance * Math.sqrt (meandistance);
			W = (date.julian - epoch ) * 0.0364911624 / temp;
			/* The constant above is 3 k / sqrt(2),
			 * k = Gaussian gravitational constant = 0.01720209895 . */
			E = 0.0;
			M = 1.0;
			while (Math.abs(M) > 1.0e-11) {
				temp = E * E;
				temp = (2.0 * E * temp + W)/( 3.0 * (1.0 + temp));
				M = temp - E;
				if( temp != 0.0 ) {
					M /= temp;
				}
				E = temp;
			}
			r = meandistance * (1.0 + E * E );
			M = Math.atan (E);
			M = 2.0 * M;
			alat = M + $const.DTR*argperih;
			// goto parabcon;
		} else {
			if( eccent > 1.0 ) {
				/* The equation of the hyperbola in polar coordinates r, theta
				 * is r = a(e^2 - 1)/(1 + e cos(theta))
				 * so the perihelion distance q = a(e-1),
				 * the "mean distance"  a = q/(e-1).
				 */
				meandistance = meandistance/(eccent - 1.0);
				temp = meandistance * Math.sqrt(meandistance);
				W = (date.julian - epoch ) * 0.01720209895 / temp;
				/* solve M = -E + e sinh E */
				E = W/(eccent - 1.0);
				M = 1.0;
				while( Math.abs(M) > 1.0e-11 )
				{
					M = -E + eccent * $util.sinh(E) - W;
					E += M/(1.0 - eccent * $util.cosh(E));
				}
				r = meandistance * (-1.0 + eccent * $util.cosh(E));
				temp = (eccent + 1.0)/(eccent - 1.0);
				M = Math.sqrt(temp) * $util.tanh( 0.5*E );
				M = 2.0 * Math.atan(M);
				alat = M + $const.DTR * argperih;
				// goto parabcon;
			} else {
				/* Calculate the daily motion, if it is not given.
				 */
				if( dailymotion == 0.0 )
				{
					/* The constant is 180 k / pi, k = Gaussian gravitational constant.
					 * Assumes object in heliocentric orbit is massless.
					 */
					dailymotion = 0.9856076686 / (body.semiAxis * Math.sqrt(body.semiAxis));
				}
				dailymotion *= date.julian - epoch;
				/* M is proportional to the area swept out by the radius
				 * vector of a circular orbit during the time between
				 * perihelion passage and Julian date J.
				 * It is the mean anomaly at time J.
				 */
				M = $const.DTR * ( meananomaly + dailymotion );
				M = $util.modtp(M);
				/* If mean longitude was calculated, adjust it also
				 * for motion since epoch of elements.
				 */
				if( body.longitude )
				{
					body.longitude += dailymotion;
					body.longitude = $util.mod360 (body.longitude);
				}

				/* By Kepler's second law, M must be equal to
				 * the area swept out in the same time by an
				 * elliptical orbit of same total area.
				 * Integrate the ellipse expressed in polar coordinates
				 *     r = a(1-e^2)/(1 + e cosW)
				 * with respect to the angle W to get an expression for the
				 * area swept out by the radius vector.  The area is given
				 * by the mean anomaly; the angle is solved numerically.
				 *
				 * The answer is obtained in two steps.  We first solve
				 * Kepler's equation
				 *    M = E - eccent*sin(E)
				 * for the eccentric anomaly E.  Then there is a
				 * closed form solution for W in terms of E.
				 */

				E = M; /* Initial guess is same as circular orbit. */
				temp = 1.0;
				do {
					/* The approximate area swept out in the ellipse */
					temp = E - eccent * Math.sin(E)
						/* ...minus the area swept out in the circle */
						- M;
					/* ...should be zero.  Use the derivative of the error
					 * to converge to solution by Newton's method.
					 */
					E -= temp/(1.0 - eccent * Math.cos(E));
				} while ( Math.abs(temp) > 1.0e-11 );

				/* The exact formula for the area in the ellipse is
				 *    2.0*atan(c2*tan(0.5*W)) - c1*eccent*sin(W)/(1+e*cos(W))
				 * where
				 *    c1 = sqrt( 1.0 - eccent*eccent )
				 *    c2 = sqrt( (1.0-eccent)/(1.0+eccent) ).
				 * Substituting the following value of W
				 * yields the exact solution.
				 */
				temp = Math.sqrt( (1.0+eccent)/(1.0-eccent) );
				W = 2.0 * Math.atan( temp * Math.tan(0.5*E) );

				/* The true anomaly.
				 */
				W = $util.modtp(W);

				meananomaly *= $const.DTR;
				/* Orbital longitude measured from node
				 * (argument of latitude)
				 */
				if( body.longitude ) {
					alat = (body.longitude) * $const.DTR + W - meananomaly - ascnode;
				} else {
					alat = W + $const.DTR * argperih; /* mean longitude not given */
				}

				/* From the equation of the ellipse, get the
				 * radius from central focus to the object.
				 */
				r = meandistance*(1.0-eccent*eccent)/(1.0+eccent*Math.cos(W));
			}
		}
// parabcon:
		/* The heliocentric ecliptic longitude of the object
		 * is given by
		 *   tan( longitude - ascnode )  =  cos( inclination ) * tan( alat ).
		 */
		coso = Math.cos( alat );
		sino = Math.sin( alat );
		inclination *= $const.DTR;
		W = sino * Math.cos( inclination );
		E = $util.zatan2 ( coso, W ) + ascnode;

		/* The ecliptic latitude of the object
		 */
		W = sino * Math.sin( inclination );
		W = Math.asin (W);
	}
// kepdon:

	/* Convert to rectangular coordinates,
	 * using the perturbed latitude.
	 */
	rect[2] = r * Math.sin(W);
	cosa = Math.cos(W);
	rect[1] = r * cosa * Math.sin(E);
	rect[0] = r * cosa * Math.cos(E);

	/* Convert from heliocentric ecliptic rectangular
	 * to heliocentric equatorial rectangular coordinates
	 * by rotating eps radians about the x axis.
	 */
	$moshier.epsilon.calc (body.equinox);
	W = $moshier.epsilon.coseps*rect[1] - $moshier.epsilon.sineps*rect[2];
	M = $moshier.epsilon.sineps*rect[1] + $moshier.epsilon.coseps*rect[2];
	rect[1] = W;
	rect[2] = M;

	/* Precess the position
	 * to ecliptic and equinox of J2000.0
	 * if not already there.
	 */
	$moshier.precess.calc (rect, body.equinox, 1);

	/* If earth, adjust from earth-moon barycenter to earth
	 * by AA page E2.
	 */
	if( body.key == 'earth' ) {
		r = this.embofs ( date, rect); /* see below */
	}

	/* Rotate back into the ecliptic.  */
	$moshier.epsilon.calc ({julian: $const.j2000});
	W = $moshier.epsilon.coseps*rect[1] + $moshier.epsilon.sineps*rect[2];
	M = -$moshier.epsilon.sineps*rect[1] + $moshier.epsilon.coseps*rect[2];

	/* Convert to polar coordinates */
	E = $util.zatan2( rect[0], W );
	W = Math.asin( M/r );

	/* Output the polar cooordinates
	 */
	polar[0] = E; /* longitude */
	polar[1] = W; /* latitude */
	polar[2] = r; /* radius */

	// fill the body.position only if rect and polar are
	// not defined
	if (arguments.length < 4) {
		body.position = {
			date: date,
			rect: rect,
			polar: polar
		};
	}
};

/* Adjust position from Earth-Moon barycenter to Earth
 *
 * J = Julian day number
 * emb = Equatorial rectangular coordinates of EMB.
 * return = Earth's distance to the Sun (au)
 */
$ns.kepler.embofs = function (date, ea) {
	var pm = [], polm = []; // double
	var a, b; // double
	var i; // int

	/* Compute the vector Moon - Earth.  */
	$moshier.gplan.moon (date, pm, polm);

	/* Precess the lunar position
	 * to ecliptic and equinox of J2000.0
	 */
	$moshier.precess.calc (pm, date, 1);

	/* Adjust the coordinates of the Earth
	 */
	a = 1.0 / ($const.emrat +  1.0);
	b = 0.0;
	for( i=0; i<3; i++ ) {
		ea[i] = ea[i] - a * pm[i];
		b = b + ea[i] * ea[i];
	}
	/* Sun-Earth distance.  */
	return Math.sqrt (b);
};

$ns.kepler.init = function () {
	var a, b, fl, co, si, u; // double

	u = $const.glat * $const.DTR;

	/* Reduction from geodetic latitude to geocentric latitude
	 * AA page K5
	 */
	co = Math.cos(u);
	si = Math.sin(u);
	fl = 1.0 - 1.0 / $const.flat;
	fl = fl*fl;
	si = si*si;
	u = 1.0/Math.sqrt( co*co + fl*si );
	a = $const.aearth*u + $const.height;
	b = $const.aearth*fl*u  +  $const.height;
	$const.trho = Math.sqrt( a*a*co*co + b*b*si );
	$const.tlat = $const.RTD * Math.acos( a*co/$const.trho );
	if( $const.glat < 0.0 ) {
		$const.tlat = -$const.tlat;
	}
	$const.trho /= $const.aearth;

	/* Reduction from geodetic latitude to geocentric latitude
	 * AA page K5
	 */
	/*
	 tlat = glat
	 - 0.19242861 * sin(2.0*u)
	 + 0.00032314 * sin(4.0*u)
	 - 0.00000072 * sin(6.0*u);

	 trho =    0.998327073
	 + 0.001676438 * cos(2.0*u)
	 - 0.000003519 * cos(4.0*u)
	 + 0.000000008 * cos(6.0*u);
	 trho += height/6378160.;
	 */

	$const.Clightaud = 86400.0 * $const.Clight / $const.au;
	/* Radius of the earth in au
	 Thanks to Min He <Min.He@businessobjects.com> for pointing out
	 this needs to be initialized early.  */
	$const.Rearth = 0.001 * $const.aearth / $const.au;
};
// body.js
/**
 *
 * body definition {
 *
 *	// body
 *	epoch:			epoch = epoch of orbital elements
 *	inclination:	i = inclination
 *	node:			W = longitude of the ascending node
 *	perihelion:		w = argument of the perihelion
 *	semiAxis:		a = mean distance (semimajor axis), if 0.0 then = perihelionDistance / (1 - eccentricity)
 *	dailyMotion:	dm = daily motion, if 0.0 will be calculated
 *	eccentricity:	ecc = eccentricity
 *	anomaly:		M = mean anomaly
 *	equinox:		equinox = epoch of equinox and ecliptic
 *	magnitude: 		mag = visual magnitude at 1AU from earth and sun
 *	semiDiameter:	sdiam = equatorial semidiameter at 1au, arc seconds
 *	perihelionDistance: = perihelion distance
 *  // computed values
 *	longitude:		L = computed mean longitude
 *	distance:		r = computed radius vector
 *	perturbation	plat = perturbation in ecliptic latitude
 *
 *	// star
 *	ra:				ra = right ascension, radians
 *	dec:			dec = declination, radians
 *	parallax:		px = parallax, radians
 *	raMotion:		mura = proper motion in R.A., rad/century
 *	decMotion:		mudec = proper motion in Dec., rad/century
 *	velocity:		v = radial velocity, km/s
 *	equinox:		equinox = epoch of equinox and ecliptic
 *	magnitude:		mag = visual magnitude
 *
 *  // constellation
 *  index:			index of constellation (1-88)
 *  raLow:			lower right ascension, in units of hours times 3600
 *  raHight:		upper right ascension, in units of hours times 3600
 *  dec0:			lower declination, in units of degrees times 3600
 *
 * }
 *
 */

$ns.body = {
	/**
	 * Sun
	 */
	sun: {
		weight: 100
	},

	/**
	 * Planets
	 */
	mercury: {
		epoch: 2446800.5, // 05.01.1987
		inclination: 7.0048,
		node: 48.177,
		perihelion: 29.074,
		semiAxis: 0.387098,
		dailyMotion: 4.09236,
		eccentricity: 0.205628,
		anomaly: 198.7199,
		equinox: {julian: 2446800.5},
		magnitude: -0.42,
		semiDiameter: 3.36
	},
	venus: {
		epoch: 2446800.5, // 05.01.1987
		inclination: 3.3946,
		node: 76.561,
		perihelion: 54.889,
		semiAxis: 0.723329,
		dailyMotion: 1.60214,
		eccentricity: 0.006757,
		anomaly: 9.0369,
		equinox: {julian: 2446800.5},
		/* Note the calculated apparent visual magnitude for Venus
		 * is not very accurate.
		 */
		magnitude: -4.40,
		semiDiameter: 8.34
	},
	earth: {
		epoch: 2446800.5, // 05.01.1987
		inclination: 0.0,
		node: 0.0,
		perihelion: 102.884,
		semiAxis: 0.999999,
		dailyMotion: 0.985611,
		eccentricity: 0.016713,
		anomaly: 1.1791,
		equinox: {julian: 2446800.5},
		magnitude: -3.86,
		semiDiameter: 0.0,
		longitude: 0.0, // computed
		distance: 0.0, // computed
		perturbation: 0.0 // computed
	},
	moon: {
	},
	mars: {
		epoch: 2446800.5, // 05.01.1987
		inclination: 1.8498,
		node: 49.457,
		perihelion: 286.343,
		semiAxis: 1.523710,
		dailyMotion: 0.524023,
		eccentricity: 0.093472,
		anomaly: 53.1893,
		equinox: {julian: 2446800.5},
		magnitude: -1.52,
		semiDiameter: 4.68
	},
	jupiter: {
		epoch: 2446800.5, // 05.01.1987
		inclination: 1.3051,
		node: 100.358,
		perihelion: 275.129,
		semiAxis: 5.20265,
		dailyMotion: 0.0830948,
		eccentricity: 0.048100,
		anomaly: 344.5086,
		equinox: {julian: 2446800.5},
		magnitude: -9.40,
		semiDiameter: 98.44
	},
	saturn: {
		epoch: 2446800.5, // 05.01.1987
		inclination: 2.4858,
		node: 113.555,
		perihelion: 337.969,
		semiAxis: 9.54050,
		dailyMotion: 0.0334510,
		eccentricity: 0.052786,
		anomaly: 159.6327,
		equinox: {julian: 2446800.5},
		magnitude: -8.88,
		semiDiameter: 82.73
	},
	uranus: {
		epoch: 2446800.5, // 05.01.1987
		inclination: 0.7738,
		node: 73.994,
		perihelion: 98.746,
		semiAxis: 19.2233,
		dailyMotion: 0.0116943,
		eccentricity: 0.045682,
		anomaly: 84.8516,
		equinox: {julian: 2446800.5},
		magnitude: -7.19,
		semiDiameter: 35.02
	},
	neptune: {
		epoch: 2446800.5, // 05.01.1987
		inclination: 1.7697,
		node: 131.677,
		perihelion: 250.623,
		semiAxis: 30.1631,
		dailyMotion: 0.00594978,
		eccentricity: 0.009019,
		anomaly: 254.2568,
		equinox: {julian: 2446800.5},
		magnitude: -6.87,
		semiDiameter: 33.50
	},
	pluto: {
		epoch: 2446640.5,
		inclination: 17.1346,
		node: 110.204,
		perihelion: 114.21,
		semiAxis: 39.4633,
		dailyMotion: 0.00397570,
		eccentricity: 0.248662,
		anomaly: 355.0554,
		equinox: {julian: 2446640.5},
		magnitude: -1.0,
		semiDiameter: 2.07
	},

	/**
	 * Comets and asteroids
	 */
	chiron: {
		epoch: 2456000.5,
		inclination: 6.926651533484328,
		node: 209.3851130617651,
		perihelion: 339.4595737215378,
		semiAxis: 0.0, // will be calulated if 0.0
		dailyMotion: 0.0, // will be calculated
		eccentricity: 0.3792037887546262,
		anomaly: 114.8798253094007,
		equinox: {julian: 2450109.234581196786},
		magnitude: 6.5,
		semiDiameter: 0.0,
		perihelionDistance: 8.486494269138399
	},

	/**
	 * Stars (implemented, not tested)
	 */
	sirius: {
		epoch: 2000,
		hmsRa: {hours: 6, minutes: 45, seconds: 8.871},
		hmsDec: {hours: -16, minutes: 42, seconds: 57.99},
		raMotion: -3.847,
		decMotion: -120.53,
		velocity: -7.6,
		parallax: 0.3751,
		magnitude: -1.46,
		ra: 0.0,
		dec: 0.0,
		equinox: {julian: 0.0}
	}
};

$ns.body.init = function () {
	for (var key in this) {
		if (this.hasOwnProperty (key) && key != 'init') {
			// fill the 'key'
			this [key].key = key;
			// fill the ptable for the body
			if ($moshier.plan404.hasOwnProperty (key)) {
				this [key].ptable = $moshier.plan404 [key];
			}
		}
	}
};
// sun.js
$ns.sun = {};

$ns.sun.calc = function () {
	var r, x, y, t; // double
	var ecr = [], rec = [], pol = []; // double
	var i; // int
	var d;
	//double asin(), modtp(), sqrt(), cos(), sin();

	$moshier.body.sun.position = $moshier.body.sun.position || {};

	/* Display ecliptic longitude and latitude.
	 */
	for( i=0; i<3; i++ ) {
		ecr[i] = - $moshier.body.earth.position.rect [i];//-rearth[i];
	}
	r = $moshier.body.earth.position.polar [2]; //eapolar [2];

	$moshier.body.sun.position.equinoxEclipticLonLat = $moshier.lonlat.calc (ecr, $moshier.body.earth.position.date, pol, 1); // TDT

	/* Philosophical note: the light time correction really affects
	 * only the Sun's barymetric position; aberration is due to
	 * the speed of the Earth.  In Newtonian terms the aberration
	 * is the same if the Earth is standing still and the Sun moving
	 * or vice versa.  Thus the following is actually wrong, but it
	 * differs from relativity only in about the 8th decimal.
	 * It should be done the same way as the corresponding planetary
	 * correction, however.
	 */
	pol [2] = r;
	for( i=0; i<2; i++ ) {
		t = pol [2] / 173.1446327;
		/* Find the earth at time TDT - t */
		$moshier.kepler.calc ({julian: $moshier.body.earth.position.date.julian - t}, $moshier.body.earth, ecr, pol );
	}
	r = pol [2];

	for( i=0; i<3; i++ ) {
		x = -ecr[i];
		y = - $moshier.body.earth.position.rect [i]; //-rearth[i];
		ecr[i] = x;	/* position t days ago */
		rec[i] = y;	/* position now */
		pol[i] = y - x; /* change in position */
	}

	$copy ($moshier.body.sun.position, {
		date: $moshier.body.earth.position.date,
		lightTime: 1440.0*t,
		aberration: $util.showcor (ecr, pol)
	});

	/* Estimate rate of change of RA and Dec
	 * for use by altaz().
	 */
	d = $util.deltap( ecr, rec);  /* see dms.c */
	$const.dradt = d.dr;
	$const.ddecdt = d.dd;
	$const.dradt /= t;
	$const.ddecdt /= t;


	/* There is no light deflection effect.
	 * AA page B39.
	 */

	/* precess to equinox of date
	 */
	$moshier.precess.calc ( ecr, $moshier.body.earth.position.date, -1);

	for( i=0; i<3; i++ ) {
		rec[i] = ecr[i];
	}

	/* Nutation.
	 */
	$moshier.epsilon.calc ($moshier.body.earth.position.date);
	$moshier.nutation.calc ($moshier.body.earth.position.date, ecr);

	/* Display the final apparent R.A. and Dec.
	 * for equinox of date.
	 */
	$moshier.body.sun.position.constellation = $moshier.constellation.calc (ecr, $moshier.body.earth.position.date);

	$moshier.body.sun.position.apparent = $util.showrd (ecr, pol);

	/* Show it in ecliptic coordinates */
	y  =  $moshier.epsilon.coseps * rec[1]  +  $moshier.epsilon.sineps * rec[2];
	y = $util.zatan2( rec[0], y ) + $moshier.nutation.nutl;
	$moshier.body.sun.position.apparentLongitude = $const.RTD*y;
	var dmsLongitude = $util.dms (y);
	$moshier.body.sun.position.apparentLongitudeString =
		dmsLongitude.degree + '\u00B0' +
		dmsLongitude.minutes + '\'' +
		Math.floor (dmsLongitude.seconds) + '"'
	;

	$moshier.body.sun.position.apparentLongitude30String =
		$util.mod30 (dmsLongitude.degree) + '\u00B0' +
		dmsLongitude.minutes + '\'' +
		Math.floor (dmsLongitude.seconds) + '"'
	;

	$moshier.body.sun.position.geocentricDistance = -1;

	/* Report altitude and azimuth
	 */
	$moshier.body.sun.position.altaz = $moshier.altaz.calc ( pol, $moshier.body.earth.position.date );
};
// aberration.js
$ns.aberration = {};

$ns.aberration.calc = function (p, result) {
	var A, B, C; // double
	var betai, pV; // double
	var x = [], V = []; // double
	var i; // int

	/* Calculate the velocity of the earth (see vearth.c).
	 */
	$moshier.vearth.calc ($moshier.body.earth.position.date);
	betai = 0.0;
	pV = 0.0;
	for( i=0; i<3; i++ ) {
		A = $moshier.vearth.vearth [i]/$const.Clightaud;
		V[i] = A;
		betai += A*A;
		pV += p[i] * A;
	}
	/* Make the adjustment for aberration.
	 */
	betai = Math.sqrt( 1.0 - betai );
	C = 1.0 + pV;
	A = betai/C;
	B = (1.0  +  pV/(1.0 + betai))/C;

	for( i=0; i<3; i++ ) {
		C = A * p[i]  +  B * V[i];
		x[i] = C;
		$const.dp[i] = C - p[i];
	}

	result = result || {};

	$util.showcor (p, $const.dp, result);
	for( i=0; i<3; i++ ) {
		p[i] = x[i];
	}

	return result;
};
// altaz.js
$ns.altaz = {
	azimuth: 0.0,
	elevation: 0.0,
	refracted_elevation: 0.0
};

$ns.altaz.calc = function (pol, date, result) {
	var dec, cosdec, sindec, lha, coslha, sinlha; // double
	var ra, dist, last, alt, az, coslat, sinlat; // double
	// var N, D, x, y, z, TPI; // double

	result = result || {};

	ra = pol[0];
	dec = pol[1];
	dist = pol[2];
	// TPI = 2.0*Math.PI;

	/* local apparent sidereal time, seconds converted to radians
	 */
	last = $moshier.siderial.calc ( date, $const.tlong ) * $const.DTR/240.0;
	lha = last - ra; /* local hour angle, radians */
	result.dLocalApparentSiderialTime = last;
	result.localApparentSiderialTime = $util.hms (last);

	/* Display rate at which ra and dec are changing
	 */
	/*
	 *if( prtflg )
	 *	{
	 *	x = RTS/24.0;
	 *	N = x*dradt;
	 *	D = x*ddecdt;
	 *	if( N != 0.0 )
	 *		printf( "dRA/dt %.2f\"/h, dDec/dt %.2f\"/h\n", N, D );
	 *	}
	 */

	result.diurnalAberation = $moshier.diurnal.aberration ( last, ra, dec );
	ra = result.diurnalAberation.ra;
	dec = result.diurnalAberation.dec;

	/* Do rise, set, and transit times
	 trnsit.c takes diurnal parallax into account,
	 but not diurnal aberration.  */
	lha = last - ra;
	result.transit = $moshier.transit.calc ( date, lha, dec );

	/* Diurnal parallax
	 */
	result.diurnalParallax = $moshier.diurnal.parallax (last, ra, dec, dist);
	ra = result.diurnalParallax.ra;
	dec = result.diurnalParallax.dec;

	/* Diurnal aberration
	 */
	/*diurab( last, &ra, &dec );*/

	/* Convert ra and dec to altitude and azimuth
	 */
	cosdec = Math.cos(dec);
	sindec = Math.sin(dec);
	lha = last - ra;
	coslha = Math.cos(lha);
	sinlha = Math.sin(lha);

	/* Use the geodetic latitude for altitude and azimuth */
	x = $const.DTR * $const.glat;
	coslat = Math.cos(x);
	sinlat = Math.sin(x);

	N = -cosdec * sinlha;
	D =  sindec * coslat  -  cosdec * coslha * sinlat;
	az = $const.RTD * $util.zatan2( D, N );
	alt = sindec * sinlat  +  cosdec * coslha * coslat;
	alt = $const.RTD * Math.asin(alt);

	/* Store results */
	this.azimuth = az;
	this.elevation = alt; /* Save unrefracted value. */

	/* Correction for atmospheric refraction
	 * unit = degrees
	 */
	D = $moshier.refraction.calc ( alt );
	alt += D;
	this.refracted_elevation = alt;

	/* Convert back to R.A. and Dec.
	 */
	y = Math.sin($const.DTR*alt);
	x = Math.cos($const.DTR*alt);
	z = Math.cos($const.DTR*az);
	sinlha = -x * Math.sin($const.DTR*az);
	coslha = y*coslat - x*z*sinlat;
	sindec = y*sinlat + x*z*coslat;
	lha = $util.zatan2( coslha, sinlha );

	y = ra; /* save previous values, before refrac() */
	z = dec;
	dec = Math.asin( sindec );
	ra = last - lha;
	y = ra - y; /* change in ra */
	while( y < - Math.PI ) {
		y += $const.TPI;
	}
	while( y > Math.PI ) {
		y -= $const.TPI;
	}
	y = $const.RTS*y/15.0;
	z = $const.RTS*(dec - z);

	result.atmosphericRefraction = {
		deg: D,
		dRA: y,
		dDec: z
	};

	result.topocentric = {
		altitude: alt,
		azimuth: az,
		ra: ra,
		dec: dec,
		dRA: $util.hms (ra),
		dDec: $util.dms (dec)
	};

	return result;
};
// constellation.js
$ns.constellation = {
	/* Constellation names
	 */
	constel: [
		"And Andromedae",
		"Ant Antliae",
		"Aps Apodis",
		"Aql Aquilae",
		"Aqr Aquarii",
		"Ari Arietis",
		"Ara Arae",
		"Aur Aurigae",
		"Boo Bootis",
		"Cae Caeli",
		"Cam Camelopardalis",
		"Can Cancri",		/* also abbreviated Cnc */
		"Cap Capricorni",
		"Car Carinae",
		"Cas Cassiopeiae",
		"Cen Centauri",
		"Cep Cephei",
		"Cet Ceti",
		"Cha Chamaeleontis",
		"Cir Circini",
		"CMa Canis Majoris",
		"CMi Canis Minoris",
		"Cnc Cancri",
		"Col Columbae",
		"Com Comae Berenices",
		"CrA Coronae Austrinae",
		"CrB Coronae Borealis",
		"Crt Crateris",
		"Cru Crucis",
		"Crv Corvi",
		"CVn Canum Venaticorum",
		"Cyg Cygni",
		"Del Delphini",
		"Dor Doradus",
		"Dra Draconis",
		"Equ Equulei",
		"Eri Eridani",
		"For Fornacis",
		"Gem Geminorum",
		"Gru Gruis",
		"Her Herculis",
		"Hor Horologii",
		"Hya Hydrae",
		"Hyi Hydri",
		"Ind Indi",
		"Lac Lacertae",
		"Leo Leonis",
		"Lep Leporis",
		"Lib Librae",
		"LMi Leonis Minoris",
		"Lup Lupi",
		"Lyn Lyncis",
		"Lyr Lyrae",
		"Men Mensae",
		"Mic Microscopii",
		"Mon Monocerotis",
		"Mus Muscae",
		"Nor Normae",
		"Oct Octantis",
		"Oph Ophiuchi",
		"Ori Orionis",
		"Pav Pavonis",
		"Peg Pegasi",
		"Per Persei",
		"Phe Phoenicis",
		"Pic Pictoris",
		"PsA Piscis Austrini",
		"Psc Piscium",
		"Pup Puppis",
		"Pyx Pyxidis",
		"Ret Reticuli",
		"Scl Sculptoris",
		"Sco Scorpii",
		"Sct Scuti",
		"Ser Serpentis",
		"Sex Sextantis",
		"Sge Sagittae",
		"Sgr Sagittarii",
		"Tau Tauri",
		"Tel Telescopii",
		"TrA Trianguli Australis",
		"Tri Trianguli",
		"Tuc Tucanae",
		"UMa Ursae Majoris",
		"UMi Ursae Minoris",
		"Vel Velorum",
		"Vir Virginis",
		"Vol Volantis",
		"Vul Vulpeculae"
	],

	/* Greek letters
	 */
	greek: [
		"alpha",
		"beta",
		"gamma",
		"delta",
		"epsilon",
		"zeta",
		"eta",
		"theta",
		"iota",
		"kappa",
		"lambda",
		"mu",
		"nu",
		"xi",
		"omicron",
		"pi",
		"rho",
		"sigma",
		"tau",
		"upsilon",
		"phi",
		"chi",
		"psi",
		"omega"
	],

	/* Table of constellation boundaries.

	 Roman, Nancy Grace, "Identification of a Constellation from a Position"
	 Pub. Astron. Soc. Pac. 99, 695, (1987)

	 Array items are
	 Lower Right Ascension, Upper Right Ascension,
	 both in units of hours times 3600;
	 Lower Declination, in units of degrees times 3600;
	 and array index of constellation name.  */
	bndries: [
		0,  86400, 316800,  84,
		28800,  52200, 311400,  84,
		75600,  82800, 310200,  84,
		64800,  75600, 309600,  84,
		0,  28800, 306000,  16,
		33000,  38400, 295200,  10,
		0,  18000, 288000,  16,
		38400,  52200, 288000,  10,
		63000,  64800, 288000,  84,
		72600,  75600, 288000,  34,
		0,  12630, 277200,  16,
		41400,  48900, 277200,  10,
		59520,  63000, 270000,  84,
		72600,  74400, 270000,  16,
		28680,  33000, 264600,  10,
		33000,  40800, 264600,  34,
		46800,  59520, 252000,  84,
		11160,  12300, 244800,  14,
		73500,  74400, 241200,  34,
		40800,  43200, 239400,  34,
		0,   1200, 237600,  16,
		50400,  56400, 237600,  84,
		84900,  86400, 237600,  16,
		43200,  48600, 230400,  34,
		48600,  51900, 226800,  34,
		83400,  84900, 226800,  16,
		21960,  25200, 223200,  10,
		72000,  73500, 221400,  34,
		73932,  74160, 219300,  16,
		25200,  28680, 216000,  10,
		28680,  30300, 216000,  83,
		71160,  72000, 214200,  34,
		72000,  73932, 214200,  16,
		82320,  83400, 212700,  16,
		0,   8760, 210600,  14,
		69900,  71160, 208800,  34,
		6120,   6870, 207000,  14,
		8760,  11160, 205200,  14,
		11160,  11400, 205200,  10,
		80340,  82320, 202500,  16,
		18000,  21960, 201600,  10,
		50520,  51900, 199800,  83,
		51900,  69900, 199800,  34,
		11400,  12000, 198000,  10,
		79680,  80340, 198000,  16,
		74160,  79080, 197400,  16,
		0,   6120, 194400,  14,
		21960,  23400, 194400,  51,
		43500,  48600, 190800,  83,
		54900,  56700, 190800,  34,
		79080,  79680, 189900,  16,
		12000,  18000, 189000,  10,
		82320,  84000, 189000,  14,
		56700,  61200, 185400,  34,
		7350,   9060, 181800,  63,
		61200,  65640, 181800,  34,
		0,   4920, 180000,  14,
		4920,   6000, 180000,  63,
		23400,  24480, 180000,  51,
		84000,  86400, 180000,  14,
		48600,  50520, 174600,  83,
		0,   4020, 172800,  14,
		84900,  86400, 172800,  14,
		65430,  65640, 171000,  40,
		65640,  68700, 171000,  34,
		68700,  69000, 171000,  31,
		6000,   7350, 169200,  63,
		30300,  33000, 169200,  83,
		600,   3120, 165600,  14,
		43200,  43500, 162000,  83,
		24480,  26520, 160200,  51,
		78870,  79080, 158400,  31,
		78750,  78870, 157500,  31,
		69000,  69840, 156600,  31,
		33000,  36600, 151200,  83,
		36600,  38820, 144000,  83,
		55560,  56700, 144000,   8,
		56700,  58800, 144000,  40,
		33300,  34500, 143100,  51,
		0,   9060, 132300,   0,
		9060,   9240, 132300,  63,
		69690,  69840, 131400,  52,
		16200,  16890, 129600,  63,
		78240,  78750, 129600,  31,
		78750,  79200, 129600,  45,
		23520,  26520, 127800,   7,
		26520,  27900, 127800,  51,
		0,   7200, 126000,   0,
		79200,  82140, 126000,  45,
		82140,  82320, 124200,  45,
		82320,  84600, 124200,   0,
		9240,   9780, 122400,  63,
		38820,  39600, 122400,  83,
		43200,  44400, 122400,  30,
		27900,  33300, 120600,  51,
		33300,  35580, 120600,  49,
		2580,   5070, 118800,   0,
		54660,  55560, 118800,   8,
		84600,  85500, 115500,   0,
		44400,  47700, 115200,  30,
		85500,  86400, 112800,   0,
		50250,  50520, 110700,  30,
		8700,   9780, 110400,  81,
		9780,  16200, 110400,  63,
		16200,  17100, 108000,   7,
		65430,  69690, 108000,  52,
		39600,  43200, 104400,  83,
		70800,  75300, 104400,  31,
		17100,  21180, 102600,   7,
		35580,  37800, 102600,  49,
		47700,  50250, 102600,  30,
		0,    240, 100800,   0,
		5070,   6000, 100800,  81,
		21180,  23520, 100800,   7,
		28380,  28800, 100800,  38,
		75300,  78240, 100800,  31,
		69330,  70800,  99000,  31,
		6900,   8700,  98100,  81,
		58200,  58800,  97200,  26,
		54300,  54660,  93600,   8,
		54660,  58200,  93600,  26,
		66120,  67920,  93600,  52,
		38700,  39600,  91800,  49,
		67920,  69330,  91800,  52,
		6000,   6900,  90000,  81,
		2580,   3060,  85500,  67,
		37800,  38700,  84600,  49,
		76500,  77100,  84600,  88,
		20520,  21180,  82200,  78,
		240,    510,  79200,   0,
		57300,  57720,  79200,  74,
		21180,  22380,  77400,  38,
		71400,  72900,  76500,  88,
		67920,  69300,  75900,  88,
		510,   3060,  75600,   0,
		72900,  74040,  73800,  88,
		28110,  28380,  72000,  38,
		74040,  76500,  70200,  88,
		69300,  71400,  69000,  88,
		11820,  12120,  68400,   5,
		67920,  68400,  66600,  76,
		20520,  20760,  64800,  60,
		22380,  22710,  63000,  38,
		68400,  71400,  58200,  76,
		17880,  19200,  57600,  78,
		57300,  57900,  57600,  40,
		71400,  72900,  56700,  76,
		16620,  17880,  55800,  78,
		19200,  20160,  55800,  78,
		46200,  48600,  54000,  24,
		62100,  65700,  51600,  40,
		42720,  46200,  50400,  24,
		27000,  28110,  48600,  38,
		60300,  62100,  46200,  40,
		0,    510,  45000,  62,
		20160,  20760,  45000,  78,
		25200,  27000,  45000,  38,
		76020,  76800,  45000,  62,
		22710,  24960,  43200,  38,
		65700,  67920,  43200,  40,
		75150,  75780,  42600,  32,
		75780,  76020,  42600,  62,
		41460,  42720,  39600,  46,
		22470,  22710,  36000,  60,
		24960,  25200,  36000,  38,
		28110,  28530,  36000,  22,
		85800,  86400,  36000,  62,
		6000,  11820,  35700,   5,
		72510,  73080,  30600,  32,
		48600,  54300,  28800,   8,
		81900,  85800,  27000,  62,
		28530,  33300,  25200,  22,
		33300,  38700,  25200,  46,
		65700,  67184,  22500,  59,
		67184,  67920,  22500,   3,
		75000,  75150,  21600,  32,
		25200,  25260,  19800,  21,
		65700,  66330,  16200,  74,
		57900,  60300,  14400,  40,
		65700,  66330,  10800,  59,
		77280,  78000,   9900,  62,
		0,   7200,   7200,  67,
		66900,  67920,   7200,  74,
		73080,  75000,   7200,  32,
		75000,  76800,   7200,  35,
		76800,  77280,   7200,  62,
		79200,  81900,   7200,  62,
		78000,  79200,   6300,  62,
		25260,  25920,   5400,  21,
		12900,  16620,      0,  78,
		16620,  16800,      0,  60,
		25920,  29100,      0,  21,
		52800,  54300,      0,  86,
		64200,  65700,      0,  59,
		9540,  11820,  -6300,  17,
		11820,  12900,  -6300,  78,
		54300,  58560, -11700,  74,
		16800,  18300, -14400,  60,
		21000,  22470, -14400,  60,
		64200,  64680, -14400,  74,
		65700,  66900, -14400,  74,
		66900,  67920, -14400,   3,
		81900,  85800, -14400,  67,
		38700,  41460, -21600,  46,
		41460,  42600, -21600,  86,
		0,   1200, -25200,  67,
		85800,  86400, -25200,  67,
		51300,  52800, -28800,  86,
		57300,  58560, -28800,  59,
		72000,  73920, -32400,   3,
		76800,  78720, -32400,   4,
		61800,  64680, -36000,  59,
		21000,  29100, -39600,  55,
		17700,  18300, -39600,  36,
		18300,  21000, -39600,  60,
		29100,  30120, -39600,  42,
		34500,  38700, -39600,  75,
		42600,  46200, -39600,  86,
		63300,  63600, -42000,  59,
		67920,  72000, -43320,   3,
		17400,  17700, -52200,  36,
		73920,  76800, -54000,   4,
		61800,  65700, -57600,  74,
		65700,  67920, -57600,  73,
		30120,  30900, -61200,  42,
		58560,  58950, -65700,  59,
		30900,  32700, -68400,  42,
		38700,  39000, -68400,  27,
		58560,  58950, -69300,  59,
		56400,  57300, -72000,  48,
		45300,  46200, -79200,  29,
		46200,  51300, -79200,  86,
		32700,  35100, -86400,  42,
		6000,   9540, -87780,  17,
		9540,  13500, -87780,  36,
		39000,  42600, -88200,  27,
		42600,  45300, -88200,  29,
		51300,  53700, -88200,  48,
		58560,  60300, -88500,  59,
		0,   6000, -91800,  17,
		76800,  78720, -91800,  12,
		78720,  85800, -91800,   4,
		85800,  86400, -91800,  17,
		35100,  36900, -95400,  42,
		16920,  17400, -98100,  36,
		17400,  22020, -98100,  47,
		72000,  76800, -100800,  12,
		36900,  38100, -105000,  42,
		45300,  53700, -106200,  42,
		53700,  56400, -106200,  48,
		56400,  57600, -106200,  72,
		16500,  16920, -108000,  36,
		60300,  63360, -108000,  59,
		63360,  64200, -108000,  77,
		38100,  39000, -112200,  42,
		22020,  26520, -118800,  20,
		44100,  45300, -118800,  42,
		39000,  44100, -126000,  42,
		12600,  13500, -129600,  37,
		30120,  33720, -132300,  69,
		15360,  16500, -133200,  36,
		64200,  69000, -133200,  77,
		76800,  82800, -133200,  66,
		82800,  84000, -133200,  71,
		10800,  12600, -142500,  37,
		33720,  39600, -143100,   1,
		0,   6000, -144000,  71,
		6000,  10800, -144000,  37,
		13920,  15360, -144000,  36,
		84000,  86400, -144000,  71,
		51000,  53700, -151200,  15,
		56400,  57600, -151200,  50,
		57600,  59115, -151200,  72,
		17400,  18000, -154800,   9,
		18000,  23700, -154800,  23,
		28800,  30120, -154800,  68,
		12300,  13920, -158400,  36,
		59115,  64200, -163800,  72,
		64200,  69000, -163800,  25,
		69000,  73200, -163800,  77,
		73200,  76800, -163800,  54,
		10800,  12300, -165600,  36,
		16200,  17400, -167400,   9,
		55200,  56400, -172800,  50,
		0,   8400, -173400,  64,
		9600,  10800, -176400,  36,
		14700,  15360, -176400,  41,
		15360,  16200, -176400,   9,
		76800,  79200, -180000,  39,
		21600,  28800, -182700,  68,
		28800,  29400, -182700,  85,
		8700,   9600, -183600,  36,
		13800,  14700, -183600,  41,
		0,   6600, -185400,  64,
		21600,  22200, -189000,  13,
		29400,  30420, -190800,  85,
		12600,  13800, -191400,  41,
		13800,  14400, -191400,  33,
		0,   5700, -192600,  64,
		7800,   8700, -194400,  36,
		16200,  18000, -194400,  65,
		54180,  55200, -194400,  50,
		30420,  31800, -196200,  85,
		22200,  23400, -198000,  13,
		42600,  46200, -198000,  15,
		51000,  54180, -198000,  50,
		54180,  55200, -198000,  57,
		14400,  15600, -203400,  33,
		31800,  39600, -203400,  85,
		39600,  40500, -203400,  15,
		63000,  64800, -205200,   6,
		64800,  73200, -205200,  79,
		79200,  84000, -205200,  39,
		11520,  12600, -207000,  41,
		18000,  19800, -207000,  65,
		23400,  24600, -208800,  13,
		0,   4800, -210600,  64,
		4800,   7800, -210600,  36,
		84000,  86400, -210600,  64,
		15600,  16500, -212400,  33,
		55200,  59115, -216000,  57,
		73200,  76800, -216000,  44,
		19800,  21600, -219600,  65,
		54600,  55200, -219600,  19,
		59115,  59700, -219600,   6,
		53700,  54600, -228900,  19,
		59700,  60300, -228900,   6,
		21600,  24600, -230400,  65,
		24600,  32520, -230400,  13,
		40500,  42600, -230400,  15,
		42600,  46200, -230400,  28,
		46200,  52320, -230400,  15,
		48600,  49200, -234000,  19,
		60300,  60600, -234000,   6,
		7800,  11520, -243000,  41,
		11520,  16500, -243000,  70,
		53100,  53700, -243000,  19,
		60600,  63000, -243000,   6,
		63000,  64800, -243000,  61,
		79200,  84000, -243000,  82,
		16500,  23700, -252000,  33,
		49200,  53100, -252000,  19,
		53100,  61200, -252000,  80,
		0,   4800, -270000,  82,
		12600,  16500, -270000,  43,
		23700,  32520, -270000,  87,
		32520,  40500, -270000,  13,
		40500,  49200, -270000,  56,
		64800,  76800, -270000,  61,
		76800,  84000, -270000,  44,
		84000,  86400, -270000,  82,
		2700,   4800, -273600,  82,
		0,  12600, -297000,  43,
		27600,  49200, -297000,  18,
		49200,  64800, -297000,   2,
		12600,  27600, -306000,  53,
		0,  86400, -324000,  58
	]
};

/* Return the constellation name corresponding to a given mean equatorial
 position P.  EPOCH is the precessional equinox and ecliptic date
 of P.  */
$ns.constellation.calc = function (pp, epoch) {
	var i, k; // int
	var ra, dec, d; // double
	var p = []; // double

	for (i = 0; i < 3; i++) {
		p[i] = pp[i];
	}

	/* Precess from given epoch to J2000.  */
	$moshier.precess.calc (p, epoch, 1);
	/* Precess from J2000 to Besselian epoch 1875.0.  */
	$moshier.precess.calc (p, {julian: 2405889.25855}, -1);
	d = p[0] * p[0] + p[1] * p[1] + p[2] * p[2];
	d = Math.sqrt (d);
	ra = Math.atan2 (p[1], p[0]) * ($const.RTD * 3600. / 15.);
	if (ra < 0.0) {
		ra += 86400.0;
	}
	dec = Math.asin (p[2] / d) * ($const.RTD * 3600.);

	/* FIND CONSTELLATION SUCH THAT THE DECLINATION ENTERED IS HIGHER THAN
	 THE LOWER BOUNDARY OF THE CONSTELLATION WHEN THE UPPER AND LOWER
	 RIGHT ASCENSIONS FOR THE CONSTELLATION BOUND THE ENTERED RIGHT
	 ASCENSION
	 */
	for (i = 0; i < this.bndries.length / 4; i++) {
		k = i << 2;
		if (ra >= this.bndries[k] && ra < this.bndries[k+1] && dec > this.bndries[k+2]) {
			k = this.bndries [k+3];
			return k;
		}
	}
	return -1;
};
// deflection.js
$ns.deflectioon = {};

$ns.deflectioon.calc = function (p, q, e, result) {
	var C; // double
	var i; // int

	C = 1.974e-8/($const.SE*(1.0+$const.qe));
	for( i=0; i<3; i++ ) {
		$const.dp[i] = C*($const.pq*e[i]/$const.SE - $const.ep*q[i]/$const.SO);
		p[i] += $const.dp[i];
	}

	result = result || {};

	result.sunElongation = Math.acos ( -$const.ep )/$const.DTR;
	result.lightDeflection = $util.showcor( p, $const.dp );

	return result;
};
// diurnal.js
$ns.diurnal = {
	/* Earth radii per au. */
	DISFAC: 0.0
};

/* Diurnal aberration
 * This formula is less rigorous than the method used for
 * annual aberration.  However, the correction is small.
 */
$ns.diurnal.aberration = function (last, ra, dec, result) {
	var lha, coslha, sinlha, cosdec, sindec; // double
	var coslat, N, D; // double

	result = result || {};
	result.ra = ra;
	result.dec = dec;

	lha = last - result.ra;
	coslha = Math.cos(lha);
	sinlha = Math.sin(lha);
	cosdec = Math.cos(result.dec);
	sindec = Math.sin(result.dec);
	coslat = Math.cos( $const.DTR*$const.tlat );

	if( cosdec != 0.0 )
		N = 1.5472e-6*$const.trho*coslat*coslha/cosdec;
	else
		N = 0.0;
	result.ra += N;

	D = 1.5472e-6*$const.trho*coslat*sinlha*sindec;
	result.dec += D;

	result.dRA = $const.RTS*N/15.0;
	result.dDec = $const.RTS*D;

	return result;
};

/* Diurnal parallax, AA page D3
 */
$ns.diurnal.parallax = function (last, ra, dec, dist, result) {
	var cosdec, sindec, coslat, sinlat; // double
	var p = [], dp = [], x, y, z, D; // double

	result = result || {};
	result.ra = ra;
	result.dec = dec;

	/* Don't bother with this unless the equatorial horizontal parallax
	 * is at least 0.005"
	 */
	if( dist > 1758.8 ) {
		return result;
	}

	this.DISFAC = $const.au / (0.001 * $const.aearth);
	cosdec = Math.cos(result.dec);
	sindec = Math.sin(result.dec);

	/* Observer's astronomical latitude
	 */
	x = $const.tlat * $const.DTR;
	coslat = Math.cos(x);
	sinlat = Math.sin(x);

	/* Convert to equatorial rectangular coordinates
	 * in which unit distance = earth radius
	 */
	D = dist * this.DISFAC;
	p[0] = D*cosdec*Math.cos(result.ra);
	p[1] = D*cosdec*Math.sin(result.ra);
	p[2] = D*sindec;

	dp[0] = -$const.trho*coslat*Math.cos(last);
	dp[1] = -$const.trho*coslat*Math.sin(last);
	dp[2] = -$const.trho*sinlat;

	x = p[0] + dp[0];
	y = p[1] + dp[1];
	z = p[2] + dp[2];
	D = x*x + y*y + z*z;
	D = Math.sqrt(D);	/* topocentric distance */

	/* recompute ra and dec */
	result.ra = $util.zatan2(x,y);
	result.dec = Math.asin(z/D);
	$util.showcor (p, dp, result);
	return result;
};
// fk4fk5.js
$ns.fk4fk5 = {
	/* Factors to eliminate E terms of aberration
	 */
	A: [-1.62557e-6, -3.1919e-7, - 1.3843e-7],
	Ad: [1.244e-3, -1.579e-3, -6.60e-4],

	/* Transformation matrix for unit direction vector,
	 * and motion vector in arc seconds per century
	 */
	Mat: [
		0.9999256782, -0.0111820611, -4.8579477e-3,
		2.42395018e-6, -2.710663e-8, -1.177656e-8,
		0.0111820610, 0.9999374784, -2.71765e-5,
		2.710663e-8, 2.42397878e-6, -6.587e-11,
		4.8579479e-3, -2.71474e-5, 0.9999881997,
		1.177656e-8, -6.582e-11, 2.42410173e-6,
		-5.51e-4, -0.238565, 0.435739,
		0.99994704, -0.01118251, -4.85767e-3,
		0.238514, -2.667e-3, -8.541e-3,
		0.01118251, 0.99995883, -2.718e-5,
		-0.435623, 0.012254, 2.117e-3,
		4.85767e-3, -2.714e-5, 1.00000956
	]
};

/* Convert FK4 B1950.0 catalogue coordinates
 * to FK5 J2000.0 coordinates.
 * AA page B58.
 */
$ns.fk4fk5.calc = function (p, m, el) {
	var a, b, c; // double
	var u, v; // double array
	var R = []; // double
	var i, j; // int

	/* Note the direction vector and motion vector
	 * are already supplied by rstar.c.
	 */
	a = 0.0;
	b = 0.0;
	for( i=0; i<3; i++ ) {
		m[i] *= $const.RTS; /* motion must be in arc seconds per century */
		a += this.A[i] * p[i];
		b += this.Ad[i] * p[i];
	}
	/* Remove E terms of aberration from FK4
	 */
	for( i=0; i<3; i++ ) {
		R[i] = p[i] - this.A[i] + a * p[i];
		R[i+3] = m[i] - this.Ad[i] + b * p[i];
	}

	var u_i = 0;
	var v_i = 0;

	/* Perform matrix multiplication
	 */
	v = this.Mat;
	for( i=0; i<6; i++ ) {
		a = 0.0;
		u = R;
		for( j=0; j<6; j++ ) {
			a += u [u_i ++] * v [v_i ++];//*u++ * *v++;
		}
		if( i < 3 ) {
			p[i] = a;
		} else {
			m[i-3] = a;
		}
	}

	/* Transform the answers into J2000 catalogue entries
	 * in radian measure.
	 */
	b = p[0]*p[0] + p[1]*p[1];
	a = b + p[2]*p[2];
	c = a;
	a = Math.sqrt(a);

	el.ra = $util.zatan2( p[0], p[1] );
	el.dec = Math.asin( p[2]/a );

	/* Note motion converted back to radians per (Julian) century */
	el.raMotion = (p[0]*m[1] - p[1]*m[0])/($const.RTS*b);
	el.decMotion = (m[2]*b - p[2]*(p[0]*m[0] + p[1]*m[1]) )/($const.RTS*c*Math.sqrt(b));

	if( el.parallax > 0.0 ) {
		c = 0.0;
		for( i=0; i<3; i++ ) {
			c += p[i] * m[i];
		}

		/* divide by RTS to deconvert m (and therefore c)
		 * from arc seconds back to radians
		 */
		el.velocity = c/(21.094952663 * el.parallax * $const.RTS * a);
	}
	el.parallax = el.parallax / a;	/* a is dimensionless */
	el.epoch = $const.j2000;
};
// light.js
$ns.light = {};

$ns.light.calc = function (body, q, e) {
	var p = [], p0 = [], ptemp = []; // double
	var P, Q, E, t, x, y; // double
	var i, k; // int

	/* save initial q-e vector for display */
	for( i=0; i<3; i++ ) {
		p0[i] = q[i] - e[i];
	}

	E = 0.0;
	for( i=0; i<3; i++ ) {
		E += e[i]*e[i];
	}
	E = Math.sqrt(E);

	for( k=0; k<2; k++ ) {
		P = 0.0;
		Q = 0.0;
		for( i=0; i<3; i++ ) {
			y = q[i];
			x = y - e[i];
			p[i] = x;
			Q += y * y;
			P += x * x;
		}
		P = Math.sqrt(P);
		Q = Math.sqrt(Q);
		/* Note the following blows up if object equals sun. */
		t = (P + 1.97e-8 * Math.log( (E+P+Q)/(E-P+Q) ) )/173.1446327;
		$moshier.kepler.calc ({julian: $moshier.body.earth.position.date.julian - t}, body, q, ptemp );
	}

	body.lightTime = 1440.0 * t;

	/* Final object-earth vector and the amount by which it changed.
	 */
	for( i=0; i<3; i++ ) {
		x = q[i] - e[i];
		p[i] = x;
		$const.dp [i] = x - p0[i];
	}
	body.aberration = $util.showcor (p0, $const.dp );

	/* Calculate dRA/dt and dDec/dt.
	 * The desired correction of apparent coordinates is relative
	 * to the equinox of date, but the coordinates here are
	 * for J2000.  This introduces a slight error.
	 *
	 * Estimate object-earth vector t days ago.  We have
	 * p(?) = q(J-t) - e(J), and must adjust to
	 * p(J-t)  =  q(J-t) - e(J-t)  =  q(J-t) - (e(J) - Vearth * t)
	 *         =  p(?) + Vearth * t.
	 */
	$moshier.vearth.calc ($moshier.body.earth.position.date);

	for( i=0; i<3; i++ ) {
		p[i] += $moshier.vearth.vearth [i]*t;
	}

	var d = $util.deltap ( p, p0);  /* see dms.c */
	$const.dradt = d.dr;
	$const.ddecdt = d.dd;
	$const.dradt /= t;
	$const.ddecdt /= t;
};
// moon.js
$ns.moon = {
	ra: 0.0,	/* Right Ascension */
	dec: 0.0	/* Declination */
};

/* Calculate geometric position of the Moon and apply
 * approximate corrections to find apparent position,
 * phase of the Moon, etc. for AA.ARC.
 */
$ns.moon.calc = function () {
	var i, prtsav; // int
	var ra0, dec0; // double
	var x, y, z, lon0; // double
	var pp = [], qq = [], pe = [], re = [], moonpp = [], moonpol = []; // double

	$moshier.body.moon.position = {
		polar: [],
		rect: []
	};

	/* Geometric equatorial coordinates of the earth.  */
	for (i = 0; i < 3; i++) {
		re [i] = $moshier.body.earth.position.rect [i];
	}

	/* Run the orbit calculation twice, at two different times,
	 * in order to find the rate of change of R.A. and Dec.
	 */

	/* Calculate for 0.001 day ago
	 */
	this.calcll({julian: $moshier.body.earth.position.date.julian - 0.001}, moonpp, moonpol); // TDT - 0.001
	ra0 = this.ra;
	dec0 = this.dec;
	lon0 = moonpol[0];

	/* Calculate for present instant.
	 */
	$moshier.body.moon.position.nutation = this.calcll ($moshier.body.earth.position.date, moonpp, moonpol).nutation;

	$moshier.body.moon.position.geometric = {
		longitude: $const.RTD * $moshier.body.moon.position.polar[0],
		latitude: $const.RTD * $moshier.body.moon.position.polar[1],
		distance: $const.RTD * $moshier.body.moon.position.polar[2]
	};

	/**
	 * The rates of change.  These are used by altaz () to
	 * correct the time of rising, transit, and setting.
	 */
	$const.dradt = this.ra - ra0;
	if ($const.dradt >= Math.PI)
		$const.dradt = $const.dradt - 2.0 * Math.PI;
	if ($const.dradt <= -Math.PI)
		$const.dradt = $const.dradt + 2.0 * Math.PI;
	$const.dradt = 1000.0 * $const.dradt;
	$const.ddecdt = 1000.0*(this.dec-dec0);

	/* Rate of change in longitude, degrees per day
	 * used for phase of the moon
	 */
	lon0 = 1000.0*$const.RTD*(moonpol[0] - lon0);

	/* Get apparent coordinates for the earth.  */
	z = re [0] * re [0] + re [1] * re [1] + re [2] * re [2];
	z = Math.sqrt(z);
	for (i = 0; i < 3; i++) {
		re[i] /= z;
	}

	/* aberration of light. */
	$moshier.body.moon.position.annualAberration = $moshier.aberration.calc (re);

	/* pe[0] -= STR * (20.496/(RTS*pe[2])); */
	$moshier.precess.calc (re, $moshier.body.earth.position.date, -1);
	$moshier.nutation.calc ($moshier.body.earth.position.date, re);
	for (i = 0; i < 3; i++) {
		re[i] *= z;
	}

	$moshier.lonlat.calc ( re, $moshier.body.earth.position.date, pe, 0 );

	/* Find sun-moon-earth angles */
	for( i=0; i<3; i++ ) {
		qq[i] = re[i] + moonpp[i];
	}
	$util.angles ( moonpp, qq, re );

	/* Display answers
	 */
	$moshier.body.moon.position.apparentGeocentric = {
		longitude: moonpol [0],
		dLongitude: $const.RTD * moonpol [0],
		latitude: moonpol [1],
		dLatitude: $const.RTD * moonpol [1],
		distance: moonpol [2] / $const.Rearth
	};
	$moshier.body.moon.position.apparentLongitude = $moshier.body.moon.position.apparentGeocentric.dLongitude;
	var dmsLongitude = $util.dms ($moshier.body.moon.position.apparentGeocentric.longitude);
	$moshier.body.moon.position.apparentLongitudeString =
		dmsLongitude.degree + '\u00B0' +
		dmsLongitude.minutes + '\'' +
		Math.floor (dmsLongitude.seconds) + '"'
	;

	$moshier.body.moon.position.apparentLongitude30String =
		$util.mod30 (dmsLongitude.degree) + '\u00B0' +
		dmsLongitude.minutes + '\'' +
		Math.floor (dmsLongitude.seconds) + '"'
	;

	$moshier.body.moon.position.geocentricDistance = moonpol [2] / $const.Rearth;

	x = $const.Rearth/moonpol[2];
	$moshier.body.moon.position.dHorizontalParallax = Math.asin (x);
	$moshier.body.moon.position.horizontalParallax = $util.dms (Math.asin (x));

	x = 0.272453 * x + 0.0799 / $const.RTS; /* AA page L6 */
	$moshier.body.moon.position.dSemidiameter = x;
	$moshier.body.moon.position.Semidiameter = $util.dms (x);

	x = $const.RTD * Math.acos(-$const.ep);
	/*	x = 180.0 - RTD * arcdot (re, pp); */
	$moshier.body.moon.position.sunElongation = x;
	x = 0.5 * (1.0 + $const.pq);
	$moshier.body.moon.position.illuminatedFraction = x;

	/* Find phase of the Moon by comparing Moon's longitude
	 * with Earth's longitude.
	 *
	 * The number of days before or past indicated phase is
	 * estimated by assuming the true longitudes change linearly
	 * with time.  These rates are estimated for the date, but
	 * do not stay constant.  The error can exceed 0.15 day in 4 days.
	 */
	x = moonpol[0] - pe[0];
	x = $util.modtp ( x ) * $const.RTD;	/* difference in longitude */
	i = Math.floor (x/90);	/* number of quarters */
	x = (x - i*90.0);	/* phase angle mod 90 degrees */

	/* days per degree of phase angle */
	z = moonpol[2]/(12.3685 * 0.00257357);

	if( x > 45.0 ) {
		y = -(x - 90.0)*z;
		$moshier.body.moon.position.phaseDaysBefore = y;
		i = (i+1) & 3;
	} else {
		y = x*z;
		$moshier.body.moon.position.phaseDaysPast = y;
	}

	$moshier.body.moon.position.phaseQuarter = i;

	$moshier.body.moon.position.apparent = {
		dRA: this.ra,
		dDec: this.dec,
		ra: $util.hms (this.ra),
		dec: $util.dms (this.dec)
	};

	/* Compute and display topocentric position (altaz.c)
	 */
	pp[0] = this.ra;
	pp[1] = this.dec;
	pp[2] = moonpol[2];
	$moshier.body.moon.position.altaz = $moshier.altaz.calc (pp, $moshier.body.earth.position.date);
};

/* Calculate apparent latitude, longitude, and horizontal parallax
 * of the Moon at Julian date J.
 */
$ns.moon.calcll = function (date, rect, pol, result) {
	var cosB, sinB, cosL, sinL, y, z; // double
	var qq = [], pp = []; // double
	var i; // int

	result = result || {};

	/* Compute obliquity of the ecliptic, coseps, and sineps.  */
	$moshier.epsilon.calc (date);
	/* Get geometric coordinates of the Moon.  */
	$moshier.gplan.moon (date, rect, pol);
	/* Post the geometric ecliptic longitude and latitude, in radians,
	 * and the radius in au.
	 */
	$const.body.position.polar [0] = pol[0];
	$const.body.position.polar[1] = pol[1];
	$const.body.position.polar[2] = pol[2];

	/* Light time correction to longitude,
	 * about 0.7".
	 */
	pol[0] -= 0.0118 * $const.DTR * $const.Rearth / pol[2];

	/* convert to equatorial system of date */
	cosB = Math.cos(pol[1]);
	sinB = Math.sin(pol[1]);
	cosL = Math.cos(pol[0]);
	sinL = Math.sin(pol[0]);
	rect[0] = cosB*cosL;
	rect[1] = $moshier.epsilon.coseps*cosB*sinL - $moshier.epsilon.sineps*sinB;
	rect[2] = $moshier.epsilon.sineps*cosB*sinL + $moshier.epsilon.coseps*sinB;

	/* Rotate to J2000. */
	$moshier.precess.calc ( rect, {julian: $moshier.body.earth.position.date.julian}, 1 ); // TDT

	/* Find Euclidean vectors and angles between earth, object, and the sun
	 */
	for( i=0; i<3; i++ ) {
		pp[i] = rect[i] * pol[2];
		qq[i] = $moshier.body.earth.position.rect [i] + pp[i];
	}
	$util.angles (pp, qq, $moshier.body.earth.position.rect);

	/* Make rect a unit vector.  */
	/* for (i = 0; i < 3; i++) */
	/*  rect[i] /= EO; */

	/* Correct position for light deflection.
	 (Ignore.)  */
	/* relativity( rect, qq, rearth ); */

	/* Aberration of light.
	 The Astronomical Almanac (Section D, Daily Polynomial Coefficients)
	 seems to omit this, even though the reference ephemeris is inertial.  */
	/* annuab (rect); */

	/* Precess to date.  */
	$moshier.precess.calc (rect, {julian: $moshier.body.earth.position.date.julian}, -1); // TDT

	/* Correct for nutation at date TDT.
	 */
	result.nutation = $moshier.nutation.calc ({julian: $moshier.body.earth.position.date.julian}, rect); // TDT

	/* Apparent geocentric right ascension and declination.  */
	this.ra = $util.zatan2(rect[0],rect[1]);
	this.dec = Math.asin(rect[2]);

	/* For apparent ecliptic coordinates, rotate from the true
	 equator into the ecliptic of date.  */
	cosL = Math.cos($moshier.epsilon.eps + $moshier.nutation.nuto);
	sinL  = Math.sin($moshier.epsilon.eps + $moshier.nutation.nuto);
	y = cosL * rect[1] + sinL * rect[2];
	z = -sinL * rect[1] + cosL * rect[2];
	pol[0] = $util.zatan2( rect[0], y );
	pol[1] = Math.asin(z);

	/* Restore earth-moon distance.  */
	for( i=0; i<3; i++ ) {
		rect[i] *= $const.EO;
	}

	return result;
};

// nutation.js
$ns.nutation = {
	/* The answers are posted here by nutlo():
	 */
	jdnut: {},	/* time to which the nutation applies */
	nutl: 0.0,	/* nutation in longitude (radians) */
	nuto: 0.0,	/* nutation in obliquity (radians) */

	/* Each term in the expansion has a trigonometric
	 * argument given by
	 *   W = i*MM + j*MS + k*FF + l*DD + m*OM
	 * where the variables are defined below.
	 * The nutation in longitude is a sum of terms of the
	 * form (a + bT) * sin(W). The terms for nutation in obliquity
	 * are of the form (c + dT) * cos(W).  The coefficients
	 * are arranged in the tabulation as follows:
	 *
	 * Coefficient:
	 * i  j  k  l  m      a      b      c     d
	 * 0, 0, 0, 0, 1, -171996, -1742, 92025, 89,
	 * The first line of the table, above, is done separately
	 * since two of the values do not fit into 16 bit integers.
	 * The values a and c are arc seconds times 10000.  b and d
	 * are arc seconds per Julian century times 100000.  i through m
	 * are integers.  See the program for interpretation of MM, MS,
	 * etc., which are mean orbital elements of the Sun and Moon.
	 *
	 * If terms with coefficient less than X are omitted, the peak
	 * errors will be:
	 *
	 *   omit	error,		  omit	error,
	 *   a <	longitude	  c <	obliquity
	 * .0005"	.0100"		.0008"	.0094"
	 * .0046	.0492		.0095	.0481
	 * .0123	.0880		.0224	.0905
	 * .0386	.1808		.0895	.1129
	 */
	nt: [
		0, 0, 0, 0, 2, 2062, 2,-895, 5,
		-2, 0, 2, 0, 1, 46, 0,-24, 0,
		2, 0,-2, 0, 0, 11, 0, 0, 0,
		-2, 0, 2, 0, 2,-3, 0, 1, 0,
		1,-1, 0,-1, 0,-3, 0, 0, 0,
		0,-2, 2,-2, 1,-2, 0, 1, 0,
		2, 0,-2, 0, 1, 1, 0, 0, 0,
		0, 0, 2,-2, 2,-13187,-16, 5736,-31,
		0, 1, 0, 0, 0, 1426,-34, 54,-1,
		0, 1, 2,-2, 2,-517, 12, 224,-6,
		0,-1, 2,-2, 2, 217,-5,-95, 3,
		0, 0, 2,-2, 1, 129, 1,-70, 0,
		2, 0, 0,-2, 0, 48, 0, 1, 0,
		0, 0, 2,-2, 0,-22, 0, 0, 0,
		0, 2, 0, 0, 0, 17,-1, 0, 0,
		0, 1, 0, 0, 1,-15, 0, 9, 0,
		0, 2, 2,-2, 2,-16, 1, 7, 0,
		0,-1, 0, 0, 1,-12, 0, 6, 0,
		-2, 0, 0, 2, 1,-6, 0, 3, 0,
		0,-1, 2,-2, 1,-5, 0, 3, 0,
		2, 0, 0,-2, 1, 4, 0,-2, 0,
		0, 1, 2,-2, 1, 4, 0,-2, 0,
		1, 0, 0,-1, 0,-4, 0, 0, 0,
		2, 1, 0,-2, 0, 1, 0, 0, 0,
		0, 0,-2, 2, 1, 1, 0, 0, 0,
		0, 1,-2, 2, 0,-1, 0, 0, 0,
		0, 1, 0, 0, 2, 1, 0, 0, 0,
		-1, 0, 0, 1, 1, 1, 0, 0, 0,
		0, 1, 2,-2, 0,-1, 0, 0, 0,
		0, 0, 2, 0, 2,-2274,-2, 977,-5,
		1, 0, 0, 0, 0, 712, 1,-7, 0,
		0, 0, 2, 0, 1,-386,-4, 200, 0,
		1, 0, 2, 0, 2,-301, 0, 129,-1,
		1, 0, 0,-2, 0,-158, 0,-1, 0,
		-1, 0, 2, 0, 2, 123, 0,-53, 0,
		0, 0, 0, 2, 0, 63, 0,-2, 0,
		1, 0, 0, 0, 1, 63, 1,-33, 0,
		-1, 0, 0, 0, 1,-58,-1, 32, 0,
		-1, 0, 2, 2, 2,-59, 0, 26, 0,
		1, 0, 2, 0, 1,-51, 0, 27, 0,
		0, 0, 2, 2, 2,-38, 0, 16, 0,
		2, 0, 0, 0, 0, 29, 0,-1, 0,
		1, 0, 2,-2, 2, 29, 0,-12, 0,
		2, 0, 2, 0, 2,-31, 0, 13, 0,
		0, 0, 2, 0, 0, 26, 0,-1, 0,
		-1, 0, 2, 0, 1, 21, 0,-10, 0,
		-1, 0, 0, 2, 1, 16, 0,-8, 0,
		1, 0, 0,-2, 1,-13, 0, 7, 0,
		-1, 0, 2, 2, 1,-10, 0, 5, 0,
		1, 1, 0,-2, 0,-7, 0, 0, 0,
		0, 1, 2, 0, 2, 7, 0,-3, 0,
		0,-1, 2, 0, 2,-7, 0, 3, 0,
		1, 0, 2, 2, 2,-8, 0, 3, 0,
		1, 0, 0, 2, 0, 6, 0, 0, 0,
		2, 0, 2,-2, 2, 6, 0,-3, 0,
		0, 0, 0, 2, 1,-6, 0, 3, 0,
		0, 0, 2, 2, 1,-7, 0, 3, 0,
		1, 0, 2,-2, 1, 6, 0,-3, 0,
		0, 0, 0,-2, 1,-5, 0, 3, 0,
		1,-1, 0, 0, 0, 5, 0, 0, 0,
		2, 0, 2, 0, 1,-5, 0, 3, 0,
		0, 1, 0,-2, 0,-4, 0, 0, 0,
		1, 0,-2, 0, 0, 4, 0, 0, 0,
		0, 0, 0, 1, 0,-4, 0, 0, 0,
		1, 1, 0, 0, 0,-3, 0, 0, 0,
		1, 0, 2, 0, 0, 3, 0, 0, 0,
		1,-1, 2, 0, 2,-3, 0, 1, 0,
		-1,-1, 2, 2, 2,-3, 0, 1, 0,
		-2, 0, 0, 0, 1,-2, 0, 1, 0,
		3, 0, 2, 0, 2,-3, 0, 1, 0,
		0,-1, 2, 2, 2,-3, 0, 1, 0,
		1, 1, 2, 0, 2, 2, 0,-1, 0,
		-1, 0, 2,-2, 1,-2, 0, 1, 0,
		2, 0, 0, 0, 1, 2, 0,-1, 0,
		1, 0, 0, 0, 2,-2, 0, 1, 0,
		3, 0, 0, 0, 0, 2, 0, 0, 0,
		0, 0, 2, 1, 2, 2, 0,-1, 0,
		-1, 0, 0, 0, 2, 1, 0,-1, 0,
		1, 0, 0,-4, 0,-1, 0, 0, 0,
		-2, 0, 2, 2, 2, 1, 0,-1, 0,
		-1, 0, 2, 4, 2,-2, 0, 1, 0,
		2, 0, 0,-4, 0,-1, 0, 0, 0,
		1, 1, 2,-2, 2, 1, 0,-1, 0,
		1, 0, 2, 2, 1,-1, 0, 1, 0,
		-2, 0, 2, 4, 2,-1, 0, 1, 0,
		-1, 0, 4, 0, 2, 1, 0, 0, 0,
		1,-1, 0,-2, 0, 1, 0, 0, 0,
		2, 0, 2,-2, 1, 1, 0,-1, 0,
		2, 0, 2, 2, 2,-1, 0, 0, 0,
		1, 0, 0, 2, 1,-1, 0, 0, 0,
		0, 0, 4,-2, 2, 1, 0, 0, 0,
		3, 0, 2,-2, 2, 1, 0, 0, 0,
		1, 0, 2,-2, 0,-1, 0, 0, 0,
		0, 1, 2, 0, 1, 1, 0, 0, 0,
		-1,-1, 0, 2, 1, 1, 0, 0, 0,
		0, 0,-2, 0, 1,-1, 0, 0, 0,
		0, 0, 2,-1, 2,-1, 0, 0, 0,
		0, 1, 0, 2, 0,-1, 0, 0, 0,
		1, 0,-2,-2, 0,-1, 0, 0, 0,
		0,-1, 2, 0, 1,-1, 0, 0, 0,
		1, 1, 0,-2, 1,-1, 0, 0, 0,
		1, 0,-2, 2, 0,-1, 0, 0, 0,
		2, 0, 0, 2, 0, 1, 0, 0, 0,
		0, 0, 2, 4, 2,-1, 0, 0, 0,
		0, 1, 0, 1, 0, 1, 0, 0, 0
	],

	ss: [],
	cc: []
};

/* Nutation -- AA page B20
 * using nutation in longitude and obliquity from nutlo()
 * and obliquity of the ecliptic from epsiln()
 * both calculated for Julian date J.
 *
 * p[] = equatorial rectangular position vector of object for
 * mean ecliptic and equinox of date.
 */
$ns.nutation.calc = function (date, p) {
	var ce, se, cl, sl, sino, f; // double
	var dp = [], p1 = []; // double
	var i; // int
	var result;

	this.calclo (date); /* be sure we calculated nutl and nuto */
	$moshier.epsilon.calc (date); /* and also the obliquity of date */

	f = $moshier.epsilon.eps + this.nuto;
	ce = Math.cos( f );
	se = Math.sin( f );
	sino = Math.sin(this.nuto);
	cl = Math.cos( this.nutl );
	sl = Math.sin( this.nutl );

	/* Apply adjustment
	 * to equatorial rectangular coordinates of object.
	 *
	 * This is a composite of three rotations: rotate about x axis
	 * to ecliptic of date; rotate about new z axis by the nutation
	 * in longitude; rotate about new x axis back to equator of date
	 * plus nutation in obliquity.
	 */
	p1[0] =   cl*p[0]
		- sl*$moshier.epsilon.coseps*p[1]
		- sl*$moshier.epsilon.sineps*p[2];

	p1[1] =   sl*ce*p[0]
		+ ( cl*$moshier.epsilon.coseps*ce + $moshier.epsilon.sineps*se )*p[1]
		- ( sino + (1.0-cl)*$moshier.epsilon.sineps*ce )*p[2];

	p1[2] =   sl*se*p[0]
		+ ( sino + (cl-1.0)*se*$moshier.epsilon.coseps )*p[1]
		+ ( cl*$moshier.epsilon.sineps*se + $moshier.epsilon.coseps*ce )*p[2];

	for( i=0; i<3; i++ ) {
		dp[i] = p1[i] - p[i];
	}

	result = $util.showcor (p, dp);

	for( i=0; i<3; i++ ) {
		p[i] = p1[i];
	}

	return result;
};

/* Nutation in longitude and obliquity
 * computed at Julian date J.
 */
$ns.nutation.calclo = function (date) {
	var f, g, T, T2, T10; // double
	var MM, MS, FF, DD, OM; // double
	var cu, su, cv, sv, sw; // double
	var C, D; // double
	var i, j, k, k1, m; // int
	var p; // short array

	if( this.jdnut.julian == date.julian )
		return(0);
	this.jdnut = date;

	/* Julian centuries from 2000 January 1.5,
	 * barycentric dynamical time
	 */
	T = (date.julian - 2451545.0) / 36525.0;
	T2 = T * T;
	T10 = T / 10.0;

	/* Fundamental arguments in the FK5 reference system.  */

	/* longitude of the mean ascending node of the lunar orbit
	 * on the ecliptic, measured from the mean equinox of date
	 */
	OM = ($util.mods3600 (-6962890.539 * T + 450160.280) + (0.008 * T + 7.455) * T2)
		* $const.STR;

	/* mean longitude of the Sun minus the
	 * mean longitude of the Sun's perigee
	 */
	MS = ($util.mods3600 (129596581.224 * T + 1287099.804) - (0.012 * T + 0.577) * T2)
		* $const.STR;

	/* mean longitude of the Moon minus the
	 * mean longitude of the Moon's perigee
	 */
	MM = ($util.mods3600 (1717915922.633 * T + 485866.733) + (0.064 * T + 31.310) * T2)
		* $const.STR;

	/* mean longitude of the Moon minus the
	 * mean longitude of the Moon's node
	 */
	FF = ($util.mods3600 (1739527263.137 * T + 335778.877) + (0.011 * T - 13.257) * T2)
		* $const.STR;

	/* mean elongation of the Moon from the Sun.
	 */
	DD = ($util.mods3600 (1602961601.328 * T + 1072261.307) + (0.019 * T - 6.891) * T2)
		* $const.STR;

	/* Calculate sin( i*MM ), etc. for needed multiple angles
	 */
	this.sscc ( 0, MM, 3 );
	this.sscc ( 1, MS, 2 );
	this.sscc ( 2, FF, 4 );
	this.sscc ( 3, DD, 4 );
	this.sscc ( 4, OM, 2 );

	C = 0.0;
	D = 0.0;
	p = this.nt; /* point to start of table */

	var p_i = 0;

	for( i=0; i<105; i++ ) {
		/* argument of sine and cosine */
		k1 = 0;
		cv = 0.0;
		sv = 0.0;
		for( m=0; m<5; m++ ) {
			j = p [p_i ++]; //*p++;
			if( j ) {
				k = j;
				if( j < 0 ) {
					k = -k;
				}
				su = this.ss[m][k-1]; /* sin(k*angle) */
				if( j < 0 ) {
					su = -su;
				}
				cu = this.cc[m][k-1];
				if( k1 == 0 ) { /* set first angle */
					sv = su;
					cv = cu;
					k1 = 1;
				} else { /* combine angles */
					sw = su*cv + cu*sv;
					cv = cu*cv - su*sv;
					sv = sw;
				}
			}
		}
		/* longitude coefficient */
		f  = p [p_i ++]; //*p++;
		if( (k = p [p_i ++] /* *p++ */) != 0 ) {
			f += T10 * k;
		}

		/* obliquity coefficient */
		g = p [p_i ++]; //*p++;
		if( (k = p [p_i ++] /* *p++ */) != 0 )
		g += T10 * k;

		/* accumulate the terms */
		C += f * sv;
		D += g * cv;
	}
	/* first terms, not in table: */
	C += (-1742.*T10 - 171996.)*this.ss[4][0];	/* sin(OM) */
	D += (   89.*T10 +  92025.)*this.cc[4][0];	/* cos(OM) */
	/*
	 printf( "nutation: in longitude %.3f\", in obliquity %.3f\"\n", C, D );
	 */
	/* Save answers, expressed in radians */
	this.nutl = 0.0001 * $const.STR * C;
	this.nuto = 0.0001 * $const.STR * D;
};

/* Prepare lookup table of sin and cos ( i*Lj )
 * for required multiple angles
 */
$ns.nutation.sscc = function (k, arg, n) {
	var cu, su, cv, sv, s; // double
	var i; // int

	su = Math.sin (arg);
	cu = Math.cos (arg);
	this.ss[k] = [];
	this.cc[k] = [];

	this.ss[k][0] = su;		/* sin(L) */
	this.cc[k][0] = cu;		/* cos(L) */
	sv = 2.0 * su * cu;
	cv = cu * cu - su * su;
	this.ss[k][1] = sv;		/* sin(2L) */
	this.cc[k][1] = cv;
	for (i = 2; i < n; i++)
	{
		s = su * cv + cu * sv;
		cv = cu * cv - su * sv;
		sv = s;
		this.ss[k][i] = sv;		/* sin( i+1 L ) */
		this.cc[k][i] = cv;
	}
};

// planet.js
$ns.planet = {};

$ns.planet.calc = function (body) {
	this.prepare (body);

	/* calculate heliocentric position of the object */
	$moshier.kepler.calc ($moshier.body.earth.position.date, body);
	/* apply correction factors and print apparent place */
	this.reduce (body, body.position.rect, $moshier.body.earth.position.rect);
};

/* The following program reduces the heliocentric equatorial
 * rectangular coordinates of the earth and object that
 * were computed by kepler() and produces apparent geocentric
 * right ascension and declination.
 */
$ns.planet.reduce = function (body, q, e) {
	var p = [], temp = [], polar = []; // double
	var a, b, s; // double
	var i; // int

	/* Save the geometric coordinates at TDT
	 */
	for ( i=0; i<3; i++ ) {
		temp[i] = q[i];
	}

	/* Display ecliptic longitude and latitude, precessed to equinox
	 of date.  */
	body.equinoxEclipticLonLat = $moshier.lonlat.calc (q, $moshier.body.earth.position.date, polar, 1 );

	/* Adjust for light time (planetary aberration)
	 */
	$moshier.light.calc ( body, q, e );

	/* Find Euclidean vectors between earth, object, and the sun
	 */
	for( i=0; i<3; i++ ) {
		p[i] = q[i] - e[i];
	}

	$util.angles ( p, q, e );

	a = 0.0;
	for( i=0; i<3; i++ ) {
		b = temp[i] - e[i];
		a += b * b;
	}
	a = Math.sqrt(a);
	body.position.trueGeocentricDistance = a; /* was EO */
	body.position.equatorialDiameter = 2.0*body.semiDiameter / $const.EO;


	/* Calculate visual magnitude.
	 * "Visual" refers to the spectrum of visible light.
	 * Phase = 0.5(1+pq) = geometric fraction of disc illuminated.
	 * where pq = cos( sun-object-earth angle )
	 * The magnitude is
	 *    V(1,0) + 2.5 log10( SE^2 SO^2 / Phase)
	 * where V(1,0) = elemnt->mag is the magnitude at 1au from
	 * both earth and sun and 100% illumination.
	 */
	a = 0.5 * (1.0 + $const.pq);
	/* Fudge the phase for light leakage in magnitude estimation.
	 * Note this phase term estimate does not reflect reality well.
	 * Calculated magnitudes of Mercury and Venus are inaccurate.
	 */
	b = 0.5 * (1.01 + 0.99*$const.pq);
	s = body.magnitude + 2.1715 * Math.log( $const.EO*$const.SO ) - 1.085*Math.log(b);
	body.position.approxVisual = {
		magnitude: s,
		phase: a
	};

	/* Find unit vector from earth in direction of object
	 */
	for( i=0; i<3; i++ ) {
		p[i] /= $const.EO;
		temp[i] = p[i];
	}

	/* Report astrometric position
	 */
	body.position.astrometricJ2000 = $util.showrd (p, polar );

	/* Also in 1950 coordinates
	 */
	$moshier.precess.calc ( temp, {julian: $const.b1950}, -1 );
	body.position.astrometricB1950 = $util.showrd (temp, polar );

	/* Correct position for light deflection
	 */
	body.position.deflection = $moshier.deflectioon.calc ( p, q, e ); // relativity

	/* Correct for annual aberration
	 */
	body.position.aberration = $moshier.aberration.calc (p);

	/* Precession of the equinox and ecliptic
	 * from J2000.0 to ephemeris date
	 */
	$moshier.precess.calc ( p, $moshier.body.earth.position.date, -1 );

	/* Ajust for nutation
	 * at current ecliptic.
	 */
	$moshier.epsilon.calc ( $moshier.body.earth.position.date );
	body.position.nutation = $moshier.nutation.calc ( $moshier.body.earth.position.date, p );

	/* Display the final apparent R.A. and Dec.
	 * for equinox of date.
	 */
	body.position.constellation = $moshier.constellation.calc (p, $moshier.body.earth.position.date);
	body.position.apparent = $util.showrd (p, polar);

	/* Geocentric ecliptic longitude and latitude.  */
	for( i=0; i<3; i++ ) {
		p[i] *= $const.EO;
	}
	body.position.apparentGeocentric = $moshier.lonlat.calc ( p, $moshier.body.earth.position.date, temp, 0 );
	body.position.apparentLongitude = body.position.apparentGeocentric [0] * $const.RTD;
	body.position.apparentLongitudeString =
		body.position.apparentGeocentric [3].degree + '\u00B0' +
		body.position.apparentGeocentric [3].minutes + '\'' +
		Math.floor (body.position.apparentGeocentric [3].seconds) + '"'
	;

	body.position.apparentLongitude30String =
		$util.mod30 (body.position.apparentGeocentric [3].degree) + '\u00B0' +
		body.position.apparentGeocentric [3].minutes + '\'' +
		Math.floor (body.position.apparentGeocentric [3].seconds) + '"'
	;

	body.position.geocentricDistance = -1;

	/* Go do topocentric reductions.
	 */
	polar[2] = $const.EO;
	body.position.altaz = $moshier.altaz.calc (polar, $moshier.body.earth.position.date);
};

$ns.planet.prepare = function (body) {
	if (!body.semiAxis) {
		body.semiAxis = body.perihelionDistance / (1 - body.eccentricity);
	}
};
// refraction.js
$ns.refraction = {};

/* Atmospheric refraction
 * Returns correction in degrees to be added to true altitude
 * to obtain apparent altitude.
 */
$ns.refraction.calc = function (alt) {
	var y, y0, D0, N, D, P, Q; // double
	var i; // int

	if( (alt < -2.0) || (alt >= 90.0) ) {
		return 0.0;
	}

	/* For high altitude angle, AA page B61
	 * Accuracy "usually about 0.1' ".
	 */
	if( alt > 15.0 )
	{
		D = 0.00452*$const.atpress/((273.0+$const.attemp)*Math.tan( $const.DTR*alt ));
		return D;
	}

	/* Formula for low altitude is from the Almanac for Computers.
	 * It gives the correction for observed altitude, so has
	 * to be inverted numerically to get the observed from the true.
	 * Accuracy about 0.2' for -20C < T < +40C and 970mb < P < 1050mb.
	 */

	/* Start iteration assuming correction = 0
	 */
	y = alt;
	D = 0.0;
	/* Invert Almanac for Computers formula numerically
	 */
	P = ($const.atpress - 80.0)/930.0;
	Q = 4.8e-3 * ($const.attemp - 10.0);
	y0 = y;
	D0 = D;

	for( i=0; i<4; i++ ) {
		N = y + (7.31/(y+4.4));
		N = 1.0/Math.tan ($const.DTR * N);
		D = N*P/(60.0 + Q * (N + 39.0));
		N = y - y0;
		y0 = D - D0 - N; /* denominator of derivative */

		if( (N != 0.0) && (y0 != 0.0) ) {
		/* Newton iteration with numerically estimated derivative */
			N = y - N*(alt + D - y)/y0;
		} else {
		/* Can't do it on first pass */
			N = alt + D;
		}

		y0 = y;
		D0 = D;
		y = N;
	}
	return D;
};
// siderial.js
$ns.siderial = {};

$ns.siderial.calc = function (date, tlong) {
	var jd0; // double    /* Julian day at midnight Universal Time */
	var secs; // double  /* Time of day, UT seconds since UT midnight */
	var eqeq, gmst, jd, T0, msday; // double
	/*long il;*/

	/* Julian day at given UT */
	jd = date.universal; // UT
	jd0 = Math.floor(jd);
	secs = date.julian - jd0; // UT
	if( secs < 0.5 ) {
		jd0 -= 0.5;
		secs += 0.5;
	} else {
		jd0 += 0.5;
		secs -= 0.5;
	}
	secs *= 86400.0;

	/* Julian centuries from standard epoch J2000.0 */
	/* T = (jd - J2000)/36525.0; */
	/* Same but at 0h Universal Time of date */
	T0 = (jd0 - $const.j2000)/36525.0;

	/* The equation of the equinoxes is the nutation in longitude
	 * times the cosine of the obliquity of the ecliptic.
	 * We already have routines for these.
	 */
	$moshier.nutation.calclo(date);
	$moshier.epsilon.calc (date);
	/* nutl is in radians; convert to seconds of time
	 * at 240 seconds per degree
	 */
	eqeq = 240.0 * $const.RTD * $moshier.nutation.nutl * $moshier.epsilon.coseps;
	/* Greenwich Mean Sidereal Time at 0h UT of date */
	/* Corrections to Williams (1994) introduced in DE403.  */
	gmst = (((-2.0e-6*T0 - 3.e-7)*T0 + 9.27701e-2)*T0 + 8640184.7942063)*T0
		+ 24110.54841;
	msday = (((-(4. * 2.0e-6)*T0 - (3. * 3.e-7))*T0 + (2. * 9.27701e-2))*T0
		+ 8640184.7942063)/(86400.*36525.) + 1.0;

	/* Local apparent sidereal time at given UT */
	gmst = gmst + msday*secs + eqeq + 240.0*tlong;
	/* Sidereal seconds modulo 1 sidereal day */
	gmst = gmst - 86400.0 * Math.floor( gmst/86400.0 );
	/*
	 * il = gmst/86400.0;
	 * gmst = gmst - 86400.0 * il;
	 * if( gmst < 0.0 )
	 *	gmst += 86400.0;
	 */
	return gmst;
};

// star.js
$ns.star = {};

$ns.star.calc = function (body) {
	if (!body.isPrepared) {
		this.prepare (body);
		body.isPrepared = true;
	}
	this.reduce (body);
};

$ns.star.reduce = function (body) {
	var p = [], q = [], e = [], m = [], temp = [], polar = []; // double
	var T, vpi, epoch; // double
	var cosdec, sindec, cosra, sinra; // double
	var i; // int

	/* Convert from RA and Dec to equatorial rectangular direction
	 */
// loop:
	do {
		cosdec = Math.cos( body.dec );
		sindec = Math.sin( body.dec );
		cosra = Math.cos( body.ra );
		sinra = Math.sin( body.ra );
		q[0] = cosra * cosdec;
		q[1] = sinra * cosdec;
		q[2] = sindec;

		/* space motion */
		vpi = 21.094952663 * body.velocity * body.parallax;
		m[0] = -body.raMotion * cosdec * sinra
			- body.decMotion * sindec * cosra
			+       vpi * q[0];

		m[1] = body.raMotion * cosdec * cosra
			- body.decMotion * sindec * sinra
			+ vpi * q[1];

		m[2] = body.decMotion * cosdec
			+ vpi * q[2];

		epoch = body.epoch;

		/* Convert FK4 to FK5 catalogue */
		if( epoch == $const.b1950 ) {
			$moshier.fk4fk5.calc ( q, m, body);
			//goto loop;
		}
	} while (epoch == $const.b1950);

	for( i=0; i<3; i++ ) {
		e[i] = $moshier.body.earth.position.rect[i];
	}

	/* precess the earth to the star epoch */
	$moshier.precess.calc ( e, {julian: epoch}, -1 );

	/* Correct for proper motion and parallax
	 */
	T = ($moshier.body.earth.position.date.julian - epoch)/36525.0;
	for( i=0; i<3; i++ ) {
		p[i] = q[i]  +  T * m[i]  -  body.parallax * e[i];
	}

	/* precess the star to J2000 */
	$moshier.precess.calc (p, {julian: epoch}, 1 );
	/* reset the earth to J2000 */
	for( i=0; i<3; i++ ) {
		e[i] = $moshier.body.earth.position.rect [i];
	}

	/* Find Euclidean vectors between earth, object, and the sun
	 * angles( p, q, e );
	 */
	$util.angles ( p, p, e );

	/* Find unit vector from earth in direction of object
	 */
	for( i=0; i<3; i++ ) {
		p[i] /= $const.EO;
		temp[i] = p[i];
	}

	body.position = {};
	body.position.approxVisualMagnitude = body.magnitude;

	/* Report astrometric position
	 */
	body.position.astrimetricJ2000 = $util.showrd ( p, polar );

	/* Also in 1950 coordinates
	 */
	$moshier.precess.calc ( temp, {julian: $const.b1950}, -1 );

	body.position.astrimetricB1950 = $util.showrd (temp, polar);

	/* For equinox of date: */
	for( i=0; i<3; i++ ) {
		temp[i] = p[i];
	}

	$moshier.precess.calc ( temp, $moshier.body.earth.position.date, -1 );
	body.position.astrimetricDate = $util.showrd (temp, polar);

	/* Correct position for light deflection
	 * relativity( p, q, e );
	 */
	body.position.deflectioon = $moshier.deflectioon.calc ( p, p, e ); // relativity

	/* Correct for annual aberration
	 */
	body.position.aberration = $moshier.aberration.calc ( p );

	/* Precession of the equinox and ecliptic
	 * from J2000.0 to ephemeris date
	 */
	$moshier.precess.calc ( p, $moshier.body.earth.position.date, -1 );

	/* Ajust for nutation
	 * at current ecliptic.
	 */
	$moshier.epsilon.calc ( $moshier.body.earth.position.date );
	$moshier.nutation.calc ( $moshier.body.earth.position.date, p );

	/* Display the final apparent R.A. and Dec.
	 * for equinox of date.
	 */
	body.position.apparent = $util.showrd (p, polar);

	// prepare for display
	body.position.apparentLongitude = body.position.apparent.dRA;
	var dmsLongitude = $util.dms (body.position.apparentLongitude);
	body.position.apparentLongitudeString =
		dmsLongitude.degree + '\u00B0' +
		dmsLongitude.minutes + '\'' +
		Math.floor (dmsLongitude.seconds) + '"'
	;

	body.position.apparentLongitude30String =
		$util.mod30 (dmsLongitude.degree) + '\u00B0' +
		dmsLongitude.minutes + '\'' +
		Math.floor (dmsLongitude.seconds) + '"'
	;

	body.position.geocentricDistance = 7777;

	/* Go do topocentric reductions.
	 */
	$const.dradt = 0.0;
	$const.ddecdt = 0.0;
	polar [2] = 1.0e38; /* make it ignore diurnal parallax */

	body.position.altaz = $moshier.altaz.calc ( polar, $moshier.body.earth.position.date );
};

$ns.star.prepare = function (body) {
	var sign; // int
	var s; // char array
	var x, z; // double
	var p; // char array
	var i; // int

	/* Read in the ASCII string data and name of the object
	 */
//	sscanf( s, "%lf %lf %lf %lf %lf %lf %lf %lf %lf %lf %lf %lf %s",
//		&body->epoch, &rh, &rm, &rs, &dd, &dm, &ds,
//	&body->mura, &body->mudec, &body->v, &body->px, &body->mag, &body->obname[0] );

	x = body.epoch;
	if( x == 2000.0 ) {
		x = $const.j2000;
	} else if( x == 1950.0 ) {
		x = $const.b1950;
	} else if( x == 1900.0 ) {
		x = $const.j1900;
	} else {
		x = $const.j2000  +  365.25 * (x - 2000.0);
	}
	body.epoch = x;

	/* read the right ascension */
	if (!body.ra) {
		body.ra = 2.0 * Math.PI * (3600.0*body.hmsRa.hours + 60.0*body.hmsRa.minutes + body.hmsRa.seconds)/86400.0;
	}

	/* read the declination */
	if (!body.dec) {
		sign = 1;

		/* the '-' sign may appaer at any part of hmsDec */
		if ( (body.hmsDec.hours < 0.0) || (body.hmsDec.minutes < 0.0) || (body.hmsDec.seconds < 0.0) ) {
			sign = -1;
		}
		z = (3600.0*Math.abs(body.hmsDec.hours) + 60.0*Math.abs(body.hmsDec.minutes) + Math.abs(body.hmsDec.seconds))/$const.RTS;
		if( sign < 0 ) {
			z = -z;
		}
		body.dec = z;
	}

	body.raMotion *= 15.0/$const.RTS;	/* s/century -> "/century -> rad/century */
	body.decMotion /= $const.RTS;
	z = body.parallax;
	if( z < 1.0 ) {
		if( z <= 0.0 ) {
			body.parallax = 0.0;
		} else {
			body.parallax = $const.STR * z;  /* assume px in arc seconds */
		}
	} else {
		body.parallax = 1.0/($const.RTS * z);	/* parsecs -> radians */
	}
};
// transit.js
$ns.transit = {
	/* Earth radii per au */
	DISFAC: 2.3454780e4,

	/* cosine of 90 degrees 50 minutes: */
	COSSUN: -0.014543897651582657,
	/* cosine of 90 degrees 34 minutes: */
	COSZEN: -9.8900378587411476e-3,

	/* Returned transit, rise, and set times in radians (2 pi = 1 day) */
	r_trnsit: 0.0,
	r_rise: 0.0,
	r_set: 0.0,
	elevation_threshold: 0.0,
	semidiameter: 0.0,
	f_trnsit: 0, // int
	southern_hemisphere: 0, // int

	/* Julian dates of rise, transet and set times.  */
	t_rise: 0.0,
	t_trnsit: 0.0,
	elevation_trnsit: 0.0,
	t_set: 0.0,

	STEP_SCALE: 0.5
};

/* Calculate time of transit
 * assuming RA and Dec change uniformly with time
 */
$ns.transit.calc = function (date, lha, dec, result) {
	var x, y, z, N, D; // double
	var lhay, cosdec, sindec, coslat, sinlat; // double

	result = result || {};

	this.f_trnsit = 0;
	/* Initialize to no-event flag value. */
	this.r_rise = -10.0;
	this.r_set = -10.0;
	/* observer's geodetic latitude, in radians */
	x = $const.glat * $const.DTR;
	coslat = Math.cos(x);
	sinlat = Math.sin(x);

	cosdec = Math.cos(dec);
	sindec = Math.sin(dec);

	if (sinlat < 0) {
		this.southern_hemisphere = 1;
	} else {
		this.southern_hemisphere = 0;
	}

	/* Refer to same start of date as iter_trnsit,
	 so r_trnsit means the same thing in both programs.  */
	x = Math.floor(date.universal - 0.5) + 0.5; // UT
	x = (date.universal - x) * $const.TPI; // UT
	/* adjust local hour angle */
	y = lha;
	/* printf ("%.7f,", lha); */
	while( y < -Math.PI ) {
		y += $const.TPI;
	}
	while( y > Math.PI ) {
		y -= $const.TPI;
	}
	lhay = y;
	y =  y/( -$const.dradt/$const.TPI + 1.00273790934);
	this.r_trnsit = x - y;
	/* printf ("rt %.7f ", r_trnsit); */
	/* Ordinarily never print here.  */
	result.approxLocalMeridian = $util.hms (this.r_trnsit);
	result.UTdate = this.r_trnsit/$const.TPI;

	if( !((coslat == 0.0) || (cosdec == 0.0)) ) {
		/* The time at which the upper limb of the body meets the
		 * horizon depends on the body's angular diameter.
		 */
		switch( $const.body.key ) {
			/* Sun */
			case 'sun':
				N = this.COSSUN;
				this.semidiameter = 0.2666666666666667;
				this.elevation_threshold = -0.8333333333333333;
				break;

			/* Moon, elevation = -34' - semidiameter + parallax
			 * semidiameter = 0.272453 * parallax + 0.0799"
			 */
			case 'moon':
				N = 1.0/(this.DISFAC*$const.body.position.polar [2]);
				D = Math.asin( N ); /* the parallax */
				this.semidiameter = 0.2725076*D + 3.874e-7;
				N =  -9.890199094634534e-3 - this.semidiameter + D;
				this.semidiameter *= $const.RTD;
				this.elevation_threshold = -34.0/60.0 - this.semidiameter;
				N = Math.sin(N);
				break;

			/* Other object */
			default:
				N = this.COSZEN;
				this.semidiameter = 0.0;
				this.elevation_threshold = -0.5666666666666666;
				break;
		}
		y = (N - sinlat*sindec)/(coslat*cosdec);

		if( (y < 1.0) && (y > -1.0) )
		{
			this.f_trnsit = 1;
			/* Derivative of y with respect to declination
			 * times rate of change of declination:
			 */
			z = -$const.ddecdt*(sinlat + this.COSZEN*sindec);
			z /= $const.TPI*coslat*cosdec*cosdec;
			/* Derivative of acos(y): */
			z /= Math.sqrt( 1.0 - y*y);
			y = Math.acos(y);
			D = -$const.dradt/$const.TPI + 1.00273790934;
			this.r_rise = x - (lhay + y)*(1.0 + z)/D;
			this.r_set = x - (lhay - y)*(1.0 - z)/D;
			/* Ordinarily never print here.  */

			result.dApproxRiseUT = this.r_rise;
			result.dApproxSetUT = this.r_set;
			result.approxRiseUT = $util.hms (this.r_rise);
			result.approxSetUT = $util.hms (this.r_set);
		}
	}
	return result;
};

/* Compute estimate of lunar rise and set times for iterative solution.  */
$ns.transit.iterator = function (julian, callback) {
	var date = {
		julian: julian
	};

	$moshier.toGregorian (date);
	$moshier.julian.calc (date);
	$moshier.delta.calc (date);

	$moshier.kepler (date, $moshier.body.earth);

	callback ();
};

/* Iterative computation of rise, transit, and set times.  */
$ns.transit.iterateTransit = function (callback, result) {
	//var JDsave, TDTsave, UTsave; // double
	var date, date_trnsit, t0, t1; // double
	var rise1, set1, trnsit1, loopctr, retry; // double
	var isPrtrnsit = false;

	result = result || {};

	loopctr = 0;
	//JDsave = JD;
	//TDTsave = TDT;
	//UTsave = UT;
	retry = 0;
	/* Start iteration at time given by the user.  */
	t1 = $moshier.body.earth.position.date.universal; // UT

	/* Find transit time. */
	do {
		t0 = t1;
		date = Math.floor (t0 - 0.5) + 0.5;
		this.iterator (t0, callback);
		t1 = date + this.r_trnsit / $const.TPI;
		if (++loopctr > 10) {
			break;
			// goto no_trnsit;
		}
	} while (Math.abs (t1 - t0) > .0001);

	if (!(loopctr > 10)) {
		this.t_trnsit = t1;
		this.elevation_trnsit = $moshier.altaz.elevation;
		trnsit1 = this.r_trnsit;
		set1 = this.r_set;
		if (this.f_trnsit == 0) {
			/* Rise or set time not found.  Apply a search technique to
			 check near inferior transit if object is above horizon now.  */
			this.t_rise = -1.0;
			this.t_set = -1.0;
			if ($moshier.altaz.elevation > this.elevation_threshold) {
				this.noRiseSet (this.t_trnsit, callback);
			}
			// goto prtrnsit;
		} else {
			/* Set current date to be that of the transit just found.  */
			date_trnsit = date;
			t1 = date + this.r_rise / $const.TPI;
			/* Choose rising no later than transit.  */
			if (t1 >= this.t_trnsit) {
				date -= 1.0;
				t1 = date + this.r_rise / $const.TPI;
			}
			loopctr = 0;
			do {
				t0 = t1;
				this.iterator (t0, callback);
				/* Skip out if no event found.  */
				if (this.f_trnsit == 0) {
					/* Rise or set time not found.  Apply search technique.  */
					this.t_rise = -1.0;
					this.t_set = -1.0;
					this.noRiseSet (this.t_trnsit, callback);
					isPrtrnsit = true;
					// goto prtrnsit;
				} else {
					if (++loopctr > 10) {
						// Rise time did not converge
						this.f_trnsit = 0;
						isPrtrnsit = true;
						// goto prtrnsit;
					} else {
						t1 = date + this.r_rise / $const.TPI;
						if (t1 > this.t_trnsit) {
							date -= 1;
							t1 = date + this.r_rise / $const.TPI;
						}
					}
				}
			} while (Math.abs (t1 - t0) > .0001);

			if (!isPrtrnsit) {
				isPrtrnsit = false;
				rise1 = this.r_rise;
				this.t_rise = t1;

				/* Set current date to be that of the transit.  */
				date = date_trnsit;
				this.r_set = set1;
				/* Choose setting no earlier than transit.  */
				t1 = date + this.r_set / $const.TPI;
				if (t1 <= this.t_trnsit) {
					date += 1.0;
					t1 = date + this.r_set / $const.TPI;
				}
				loopctr = 0;
				do {
					t0 = t1;
					this.iterator (t0, callback);
					if (this.f_trnsit == 0) {
						/* Rise or set time not found.  Apply search technique.  */
						this.t_rise = -1.0;
						this.t_set = -1.0;
						this.noRiseSet (this.t_trnsit, callback);
						isPrtrnsit = true;
						//goto prtrnsit;
					} else {
						if (++loopctr > 10) {
							// Set time did not converge
							this.f_trnsit = 0;
							isPrtrnsit = true;
							//goto prtrnsit;
						} else {
							t1 = date + this.r_set / $const.TPI;
							if (t1 < this.t_trnsit) {
								date += 1.0;
								t1 = date + this.r_set / $const.TPI;
							}
						}
					}
				} while (fabs(t1 - t0) > .0001);

				if (!isPrtrnsit) {
					this.t_set = t1;
					this.r_trnsit = trnsit1;
					this.r_rise = rise1;
				}
			}
		}
// prtrnsit:
		result.localMeridianTransit = $moshier.julian.toGregorian ({julian: this.t_trnsit});
		if (this.t_rise != -1.0) {
			result.riseDate = $moshier.julian.toGregorian ({julian: this.t_rise});
		}
		if (this.t_set != -1.0) {
			result.setDate = $moshier.julian.toGregorian ({julian: this.t_set});
			if (this.t_rise != -1.0) {
				t0 = this.t_set - this.t_rise;
				if ((t0 > 0.0) && (t0 < 1.0)) {
					result.visibleHaours = 24.0 * t0;
				}
			}
		}

		if (
			(Math.abs($moshier.body.earth.position.date.julian - this.t_rise) > 0.5) &&
			(Math.abs($moshier.body.earth.position.date.julian - this.t_trnsit) > 0.5) &&
			(Math.abs($moshier.body.earth.position.date.julian - this.t_set) > 0.5)
		) {
			// wrong event date
			result.wrongEventDate = true;
		}
	}
// no_trnsit:
	//JD = JDsave;
	//TDT = TDTsave;
	//UT = UTsave;
	/* Reset to original input date entry.  */
	// update();
	//prtflg = prtsave;
	this.f_trnsit = 1;
	return result;
};

/* If the initial approximation fails to locate a rise or set time,
 this function steps between the transit time and the previous
 or next inferior transits to find an event more reliably.  */
$ns.transit.noRiseSet = function (t0, callback) {
	var t_trnsit0 = this.t_trnsit; // double
	var el_trnsit0 = this.elevation_trnsit; // double
	var t, e; // double
	var t_above, el_above, t_below, el_below; // double

	/* Step time toward previous inferior transit to find
	 whether a rise event was missed.  The step size is a function
	 of the azimuth and decreases near the transit time.  */
	t_above = t_trnsit0;
	el_above = el_trnsit0;
	t_below = -1.0;
	el_below = el_above;
	t = t_trnsit0 - 0.25;
	e = 1.0;
	while (e > 0.005) {
		this.iterator (t, callback);
		if ($moshier.altaz.elevation > this.elevation_threshold) {
			/* Object still above horizon.  */
			t_above = t;
			el_above = $moshier.altaz.elevation;
		} else {
			/* Object is below horizon.  Rise event is bracketed.
			 Proceed to interval halving search.  */
			t_below = t;
			el_below = $moshier.altaz.elevation;
			break; // goto search_rise;
		}
		/* Step time by an amount proportional to the azimuth deviation.  */
		e = this.azimuth/360.0;
		if ( this.azimuth < 180.0)
		{
			if (this.southern_hemisphere == 0) {
				t -= this.STEP_SCALE * e;
			} else {
				t += this.STEP_SCALE * e;
			}
		} else {
			e = 1.0 - e;
			if (this.southern_hemisphere == 0) {
				t += this.STEP_SCALE * e;
			} else {
				t -= this.STEP_SCALE * e;
			}
		}
	}

	/* No rise event detected.  */
	if ($moshier.altaz.elevation > this.elevation_threshold) {
		/* printf ("Previous inferior transit is above horizon.\n"); */
		this.t_rise = -1.0;
		// goto next_midnight;
	} else {
	/* Find missed rise time. */
// search_rise:
		this.t_rise = this.searchHalve (t_below, el_below, t_above, el_above, callback);
		this.f_trnsit = 1;
	}

// next_midnight:
	/* Step forward in time toward the next inferior transit.  */
	t_above = t_trnsit0;
	el_above = el_trnsit0;
	t_below = -1.0;
	el_below = el_above;
	t = t_trnsit0 + 0.25;
	e = 1.0;
	while (e > 0.005) {
		this.iterator (t, callback);
		if ($moshier.altaz.elevation > this.elevation_threshold) {
			/* Object still above horizon.  */
			t_above = t;
			el_above = $moshier.altaz.elevation;
		} else {
			/* Object is below horizon.  Event is bracketed.
			 Proceed to interval halving search.  */
			t_below = t;
			el_below = $moshier.altaz.elevation;
			break; // goto search_set;
		}
		/* Step time by an amount proportional to the azimuth deviation.  */
		e = $moshier.altaz.azimuth/360.0;
		if ($moshier.altaz.azimuth < 180.0) {
			if (this.southern_hemisphere == 0) {
				t -= this.STEP_SCALE * e;
			} else {
				t += this.STEP_SCALE * e;  /* Southern hemisphere observer.  */
			}
		} else {
			e = 1.0 - e;
			if (this.southern_hemisphere == 0) {
				t += this.STEP_SCALE * e;
			} else {
				t -= this.STEP_SCALE * e;
			}
		}
	}

	if ($moshier.altaz.elevation > this.elevation_threshold) {
		/* printf ("Next inferior transit is above horizon.\n"); */
		this.t_set = -1.0;
		// return 0;
	} else {
	/* Find missed set time. */
// search_set:
		this.t_set = search_halve (t, elevation, this.t_trnsit, this.elevation_trnsit, callback);
		this.f_trnsit = 1;
	}
};

/* Search rise or set time by simple interval halving
 after the event has been bracketed in time.  */
$ns.transit.searchHalve = function (t1, y1, t2, y2, callback) {
	var e2, e1, em, tm, ym; // double

	e2 = y2 - this.elevation_threshold;
	e1 = y1 - this.elevation_threshold;
	tm = 0.5 * (t1 + t2);

	while( Math.abs(t2 - t1) > .00001 ) {
		/* Evaluate at middle of current interval.  */
		tm = 0.5 * (t1 + t2);
		this.iterator (tm, callback);
		ym = $moshier.altaz.elevation;
		em = ym - this.elevation_threshold;
		/* Replace the interval boundary whose error has the same sign as em.  */
		if( em * e2 > 0 ) {
			y2 = ym;
			t2 = tm;
			e2 = em;
		} else {
			y1 = ym;
			t1 = tm;
			e1 = em;
		}
	}
	return tm;
};
// vearth.js
$ns.vearth = {
	jvearth: -1.0,
	vearth: []
};

$ns.vearth.calc = function (date) {
	var e = [], p = [], t; // double
	var i; // int

	if( date.julian == this.jvearth ) {
		return;
	}

	this.jvearth = date.julian;

	/* calculate heliocentric position of the earth
	 * as of a short time ago.
	 */
	t = 0.005;
	$moshier.kepler.calc ({julian: date.julian - t}, $moshier.body.earth, e, p);

	for( i=0; i<3; i++ ) {
		this.vearth [i] = ($moshier.body.earth.position.rect [i] - e[i])/t;
	}
};
// processor.js
$ns.processor = {};

$ns.processor.calc = function (date, body) {
	$const.body = body;

	$moshier.julian.calc (date);
	$moshier.delta.calc (date);

	date.universalDate = $moshier.julian.toGregorian ({
		julian: date.universal
	});

	date.universalDateString =
		date.universalDate.day + '.' +
		date.universalDate.month + '.' +
		date.universalDate.year + ' ' +
		date.universalDate.hours + ':' +
		date.universalDate.minutes + ':' +
		(date.universalDate.seconds + date.universalDate.milliseconds / 1000)
	;

	// First to calculate the erath
	$moshier.kepler.calc (date, $moshier.body.earth);

	switch (body.key) {
		case 'sun':
			$moshier.sun.calc ();
			break;
		case 'moon':
			$moshier.moon.calc ();
			break;
		default:
			if (body.raMotion) { // star
				$moshier.star.calc (body);
			} else { // planet
				$moshier.planet.calc (body);
			}
			break;
	}
};

$ns.processor.ecliptic = function (date, observer, body) {
	this.calc (date, observer);
	this.calc (date, body);

	//this.reduce (observer, body);
};

$ns.processor.init = function () {
	$moshier.body.init ();
	$moshier.kepler.init ();
};

$ns.processor.test = function () {
	var body, date;

	// tested position
	$copy ($const, {
		tlong: -71.13,
		glat: 42.27,
		attemp: 12.0,
		atpress: 1010.0,
		height: 0.0
	});

	// initialize processor
	this.init ();

	// test the moon
	date = {year: 1986, month: 1, day: 1, hours: 1, minutes: 52, seconds: 0};
	body = $moshier.body.moon;
	this.calc (date, body);

	$assert (date.julian, 2446431.577777778);
	$assert (date.delta, 54.87009963821919);

	$assert (body.position.nutation.dRA, -0.48342256851185134);
	$assert (body.position.nutation.dDec, 5.886353197581648);

	$assert (body.position.geometric.longitude, 156.0921880198016);
	$assert (body.position.geometric.latitude, 4.422063993387057);
	$assert (body.position.geometric.distance, 0.14716616073282882);

	$assert (body.position.apparentGeocentric.longitude, 2.7242742960376667);
	$assert (body.position.apparentGeocentric.latitude, 0.07717957641849299);
	$assert (body.position.apparentGeocentric.distance, 60.24442952894567);

	$assert (body.position.dHorizontalParallax, 0.016599807399569004);

	$assert (body.position.sunElongation, 124.15076164595345);
	$assert (body.position.illuminatedFraction, 0.7815787330095528);

	$assert (body.position.apparent.dRA, 2.7844808512258266);
	$assert (body.position.apparent.dDec, 0.23362556081599462);

	$assert (body.position.altaz.diurnalAberation.ra, 2.7844805966970942);
	$assert (body.position.altaz.diurnalAberation.dec, 0.23362530162522877);

	$assert (body.position.altaz.diurnalParallax.ra, 2.7967931740378766);
	$assert (body.position.altaz.diurnalParallax.dec, 0.2221893682125501);

	$assert (body.position.altaz.atmosphericRefraction.deg, 0.6356568799861307);
	$assert (body.position.altaz.atmosphericRefraction.dRA, -112.9014532718829);
	$assert (body.position.altaz.atmosphericRefraction.dDec, 1585.1382135790564);

	$assert (body.position.altaz.topocentric.altitude, -0.2989379770846806);
	$assert (body.position.altaz.topocentric.ra, -3.4946025585162133);
	$assert (body.position.altaz.topocentric.dec, 0.22987433513647665);
	$assert (body.position.altaz.topocentric.azimuth, 71.78002666681668);

	// test the sun
	date = {year: 1986, month: 1, day: 1, hours: 16, minutes: 47, seconds: 0};
	body = $moshier.body.sun;
	this.calc (date, body);

	$assert (date.julian, 2446432.199305556);
	$assert (date.delta, 54.87089572485891);

	$assert (body.position.equinoxEclipticLonLat [0], 4.90413951369789);
	$assert (body.position.equinoxEclipticLonLat [1], 0.000002184617423267333);
	$assert (body.position.equinoxEclipticLonLat [2], 0.9832794756330766);

	$assert (body.position.lightTime, 8.177686171897745);

	$assert (body.position.aberration.dRA, 1.50327643199855);
	$assert (body.position.aberration.dDec, 1.7448150469138453);

	$assert (body.position.constellation, 77);

	$assert (body.position.apparent.dRA, 4.920756988829355);
	$assert (body.position.apparent.dDec, -0.40123417213339135);

	$assert (body.position.apparentLongitude, 280.9781321178379);

	$assert (body.position.altaz.diurnalParallax.ra, 4.920758543965699);
	$assert (body.position.altaz.diurnalParallax.dec, -0.4012734282906353);

	$assert (body.position.altaz.atmosphericRefraction.deg, 0.0347669495824713);
	$assert (body.position.altaz.atmosphericRefraction.dRA, -0.0654871080210392);
	$assert (body.position.altaz.atmosphericRefraction.dDec, 125.15775095794257);

	$assert (body.position.altaz.topocentric.altitude, 24.771802544653966);
	$assert (body.position.altaz.topocentric.ra, -1.3624315255707726);
	$assert (body.position.altaz.topocentric.dec, -0.4006666463910222);
	$assert (body.position.altaz.topocentric.azimuth, 179.48488458374226);

	// test the sirius
	date = {year: 1986, month: 1, day: 1, hours: 0, minutes: 0, seconds: 0};
	body = $moshier.body.sirius;
	this.calc (date, body);

	$assert (date.julian, 2446431.5);
	$assert (date.delta, 54.87);

	$assert (body.position.apparent.dRA, 1.7651675096112047);
	$assert (body.position.apparent.dDec, -0.29137543179606207);

	$assert (body.position.astrimetricDate.dRA, 1.7651002655957506);
	$assert (body.position.astrimetricDate.dDec, -0.29140596467162816);

	$assert (body.position.altaz.topocentric.altitude, 1.7060953673767152);
	$assert (body.position.altaz.topocentric.ra, -4.522192086886859);
	$assert (body.position.altaz.topocentric.dec, -0.2873401996237649);
	$assert (body.position.altaz.topocentric.azimuth, 114.21923743994829);

	// test the sirius
	date = {year: 1986, month: 1, day: 1, hours: 0, minutes: 0, seconds: 0};
	body = $moshier.body.sirius;
	this.calc (date, body);

	$assert (date.julian, 2446431.5);
	$assert (date.delta, 54.87);

	$assert (body.position.apparent.dRA, 1.7651675096112047);
	$assert (body.position.apparent.dDec, -0.29137543179606207);

	$assert (body.position.astrimetricDate.dRA, 1.7651002655957506);
	$assert (body.position.astrimetricDate.dDec, -0.29140596467162816);

	$assert (body.position.altaz.topocentric.altitude, 1.7060953673767152);
	$assert (body.position.altaz.topocentric.ra, -4.522192086886859);
	$assert (body.position.altaz.topocentric.dec, -0.2873401996237649);
	$assert (body.position.altaz.topocentric.azimuth, 114.21923743994829);
};
// index.js
$ns = ephemeris.astronomy.moshier.plan404 = {};

// mercury.js
$ns.mercury = {
	maxargs: 9,
	max_harmonic: [11, 14, 10, 11, 4, 5, 2, 0, 0],
	max_power_of_t: 6,
	distance: 3.8709830979999998e-01,
	timescale: 3652500.0,
	trunclvl: 1.0,
	lon_tbl: [
		35.85255, -163.26379, 53810162857.56026, 908082.18475,
		0.05214, -0.07712,
		1.07258, 0.04008, 0.49259, 0.00230,
		0.02324, 0.05869,
		0.24516, 0.22898, -0.06037, 0.13023,
		0.00331, -0.03576,
		0.06464, 0.00089,
		0.03103, 0.05078,
		-0.01133, 0.01520,
		0.14654, 0.07538, 0.25112, -0.24473,
		-0.17928, -0.53366,
		-0.06367, 0.20458, -0.42985, 0.14848,
		-0.35317, -0.61364,
		0.00325, -0.08617, -0.23180, 0.08576,
		0.22995, 0.43569,
		1.92114, 2.89319, -5.55637, 4.70329,
		-4.91411, -5.45521,
		0.02607, 0.04468,
		-0.05439, 0.13476, -0.07329, -0.00985,
		-0.00278, 0.05377,
		0.07474, -0.09658, 0.29818, 0.20422,
		-0.29074, 0.44962,
		-0.15411, -0.04287, 0.29907, -1.02948,
		3.62183, 0.84869,
		-0.08157, 0.02754,
		-0.03610, -0.12909, 0.09195, -0.04424,
		-0.08845, 0.09347,
		-0.27140, 0.08185,
		0.24783, 0.19543, -0.25154, 0.41371,
		-0.00046, 0.01524,
		0.04127, 0.06663,
		0.43023, 0.11790,
		0.04427, 0.05329,
		0.00411, -0.71074,
		-0.07111, -0.09824,
		0.01264, -0.02075,
		-0.00068, -0.01678,
		0.01186, 0.00181,
		0.00302, -0.21963,
		-0.06412, -0.10155, -0.36856, 0.20240,
		0.32282, 0.65133,
		-0.07178, -0.01876, 0.13399, -0.39522,
		1.28413, 0.33790,
		0.05040, -0.01679,
		-0.00794, 0.01117,
		0.02630, 0.00575,
		-0.07113, -0.11414, 0.16422, -0.23060,
		0.35198, 0.05409,
		1.11486, -0.35833, 0.87313, 1.66304,
		-1.28434, 0.72067,
		0.01400, 0.00971,
		0.21044, -0.87385, 3.20820, 0.67957,
		-0.01716, 0.00111,
		-0.13776, -0.02650,
		-0.06778, 0.00908, 0.00616, -0.04520,
		-0.31625, -0.61913,
		0.36184, 0.09373,
		0.00984, -0.03292,
		0.01944, 0.00530,
		0.00243, -0.00123,
		0.01589, 0.02223,
		-0.02992, -0.01086,
		4356.04809, -5859.86328, 2918.27323, -4796.67315,
		510.24783, -1220.02233, 127.48927, 250.10654,
		3250.43013, -904.27614, -5667.40042, -22634.00922,
		-82471.79425, 18615.92342,
		0.01941, 0.00372,
		0.01830, -0.00652,
		-0.02548, -0.01157,
		0.00635, 0.02343,
		-0.00980, 0.00961,
		0.12137, 0.10068, 0.16676, -0.07257,
		-0.07267, -0.13761, 0.25305, -0.28112,
		-0.07974, 0.07866,
		-0.41726, 0.49991, -1.55187, -1.14150,
		1.54754, -2.35141,
		-0.00862, 0.00808,
		0.00218, -0.03726,
		0.06914, -0.08986,
		-0.00501, 2.09577,
		-0.01409, -0.01842,
		0.04138, 0.05961,
		-0.12276, -0.04929,
		-0.03963, -0.06080,
		-0.27697, -0.09329,
		-0.01011, 0.00295,
		-0.01374, 0.01328,
		-0.00171, 0.25815,
		0.01446, 0.00782,
		0.17909, -0.04683,
		0.03765, -0.04990,
		0.00036, 0.00528,
		0.05508, -0.01369,
		-0.11751, -0.10624, -0.14448, 0.10522,
		-0.00884, 0.43006,
		0.01162, 0.01659,
		-0.00076, 0.10143,
		0.55779, 0.05510, 0.12350, -0.34025,
		0.01320, 0.92985,
		-0.00026, -0.03426,
		0.01305, 0.00041,
		0.13187, -0.11903,
		0.00058, 0.09877,
		-33.10230, -41.96782, -268.28908, 174.29259,
		731.20089, 1508.07639, 5223.99114, -3008.08849,
		-3909.34957, -9646.69156,
		0.02988, 0.03182,
		0.07149, 0.04513,
		-0.02356, -0.01641,
		-0.03188, -0.03711, 0.15084, -0.22436,
		0.61987, 0.25706,
		0.02425, 0.01200,
		-0.05543, -0.14435, -0.53398, 0.10997,
		0.00465, -0.01893,
		0.01260, -0.01314,
		0.00650, -0.05499,
		-0.06804, 0.01608,
		0.02134, 0.04160,
		0.00636, 0.01293,
		-0.03470, -0.02697,
		-0.11323, 0.02409,
		-0.02618, 0.00827,
		0.01879, 0.16838, 0.08978, 0.01934,
		-0.23564, 0.05565,
		0.03686, 0.02644,
		-0.02471, 0.00558,
		-140.22669, -120.40692, -501.88143, 434.05868,
		1044.54998, 1162.72084, 1527.78437, -882.37371,
		-0.00768, 0.02213,
		-0.04090, 0.16718,
		-0.05923, -0.12595,
		0.01154, -0.00025,
		-0.00776, -0.01653,
		-0.01213, -0.02773,
		0.00344, 0.02180,
		-0.02558, -0.05682,
		-0.00490, 0.01050,
		38.75496, -78.17502, -189.90700, -136.33371,
		-249.94062, 319.76423, 205.73478, 272.64549,
		-0.01132, -0.01071, -0.04607, -0.00390,
		0.02903, -0.02070,
		0.01326, -0.00901,
		35.38435, 7.45358, 31.08987, -70.52685,
		-92.13879, -51.58876, -51.80016, 48.98102,
		-0.00124, -0.01159,
		0.47335, 13.71886, 23.71637, 5.55804,
		10.06850, -25.65292, -11.85300, -10.20802,
		-4.72861, 1.27151, -0.47322, 7.46754,
		6.99528, 1.79089, 2.05336, -2.90866,
		-1.97528, 0.72236, -0.25084, 1.90269,
		0.72127, 0.41354,
		-0.30286, -0.53125, -0.50883, -0.01200,
		-0.08301, 0.18083,
		-0.04286, -0.10963, -0.04544, -0.01645,
		-0.00013, -0.00986
	],
	lat_tbl: [
		68.33369, 422.77623, -2057.26405, -2522.29068,
		-0.00030, -0.00009,
		0.02400, -0.06471, 0.02074, -0.00904,
		0.00044, 0.00261,
		-0.00174, -0.00088, -0.00027, 0.00003,
		0.00005, -0.00004,
		-0.00036, 0.00200,
		0.01432, 0.01199,
		0.00006, -0.00004,
		0.00236, 0.00803, 0.01235, 0.00406,
		-0.03253, 0.00179,
		-0.00243, 0.00132, -0.00352, 0.00011,
		-0.00146, -0.01154,
		0.00824, -0.01195, -0.01829, -0.00465,
		0.12540, 0.09997,
		0.00400, 0.00288, -0.02848, 0.01094,
		-0.02273, -0.07051,
		0.01305, 0.01078,
		-0.00119, 0.00136, -0.00107, -0.00066,
		0.00097, -0.00315,
		0.00120, 0.00430, -0.00710, -0.00157,
		0.06052, -0.04777,
		0.00192, -0.00229, -0.02077, 0.00647,
		0.06907, 0.07644,
		-0.00717, 0.00451,
		0.00052, -0.00262, 0.00345, 0.00039,
		-0.00674, 0.00346,
		-0.02880, 0.00807,
		0.00054, 0.00206, -0.01745, 0.00517,
		-0.00044, 0.00049,
		0.01749, 0.01230,
		0.01703, 0.01563,
		0.00934, 0.02372,
		0.01610, -0.01136,
		0.00186, -0.00503,
		0.00082, -0.00673,
		0.00170, -0.00539,
		0.00042, 0.00037,
		0.00415, -0.00430,
		0.00258, -0.00914, -0.01761, -0.00251,
		0.15909, 0.13276,
		0.02436, -0.00791, 0.00491, 0.03890,
		-0.02982, 0.05645,
		-0.00003, 0.00427,
		-0.00363, 0.00221,
		0.00077, 0.00130,
		0.00131, -0.00071, 0.00796, 0.00453,
		0.01186, 0.01631,
		0.12949, -0.02546, 0.03613, 0.32854,
		-0.43001, 0.01417,
		0.00034, 0.00095,
		-0.03268, 0.04034, 0.11407, 0.15049,
		-0.00079, -0.00052,
		-0.04009, 0.00988,
		-0.00259, -0.00085, 0.00221, -0.00133,
		0.00003, -0.01733,
		0.01055, 0.01976,
		0.00222, 0.00085,
		0.00089, 0.00087,
		0.00014, 0.00001,
		0.00145, 0.00802,
		0.00122, 0.00068,
		947.79367, -1654.39690, 542.00864, -1281.09901,
		90.02068, -318.36115, -87.67090, 92.91960,
		376.98232, -419.10705, 5094.60412, 2476.97098,
		-18160.57888, 16010.48165,
		0.00621, -0.00128,
		0.00186, -0.00153,
		-0.00790, 0.00011,
		-0.00032, 0.00165,
		-0.00277, 0.00539,
		0.00552, 0.00682, 0.01086, -0.00978,
		-0.02292, -0.01300, 0.02940, -0.04427,
		-0.02051, 0.04860,
		-0.05020, 0.29089, -0.50763, -0.04900,
		0.11177, -0.41357,
		-0.00222, 0.00504,
		-0.00006, -0.00459,
		-0.00175, -0.02691,
		0.05921, 0.18938,
		-0.00181, -0.00154,
		0.00322, 0.00586,
		-0.01098, -0.00520,
		-0.00861, -0.01342,
		-0.02694, -0.00706,
		-0.00103, 0.00012,
		-0.00284, 0.00797,
		0.00743, 0.02523,
		0.00872, 0.00096,
		0.03155, -0.01644,
		0.00414, -0.00583,
		0.00029, 0.00066,
		0.00935, -0.00619,
		-0.02498, -0.01600, -0.03545, 0.07623,
		0.01649, 0.06498,
		0.00148, 0.00209,
		0.00621, 0.02014,
		0.17407, -0.05022, -0.03485, -0.17012,
		0.06164, 0.20059,
		-0.00804, -0.01475,
		0.00296, -0.00068,
		0.01880, -0.03797,
		0.00608, 0.02270,
		5.89651, -6.62562, -37.41057, -10.51542,
		-47.22373, 95.76862, 494.45951, -5.37252,
		-3991.04809, -2886.97750,
		0.01232, 0.00487,
		0.03163, 0.00561,
		-0.01847, -0.00207,
		-0.10138, 0.01430, -0.04269, -0.22338,
		0.24955, -0.02066,
		0.01119, -0.00186,
		0.03416, 0.01805, -0.12498, 0.10385,
		-0.00210, -0.01011,
		0.00346, -0.00682,
		-0.00683, -0.02227,
		-0.01649, 0.01259,
		0.01392, 0.01174,
		0.00440, 0.00351,
		-0.02871, -0.00375,
		-0.03170, 0.02246,
		-0.00833, 0.00596,
		0.04081, 0.06666, 0.05400, -0.02387,
		-0.07852, 0.05781,
		0.01881, 0.00324,
		-0.00868, 0.00606,
		-6.52157, -19.74446, -72.46009, 43.12366,
		321.78233, 215.45201, 452.61804, -1025.05619,
		0.00119, 0.01169,
		0.02239, 0.09003,
		-0.05329, -0.03974,
		0.00688, -0.00421,
		-0.00676, -0.00515,
		-0.01171, -0.00952,
		0.01337, 0.01270,
		-0.02791, -0.02184,
		0.00058, 0.00679,
		8.42102, -11.87757, -49.07247, -25.34584,
		-43.54829, 161.26509, 261.70993, 56.25777,
		0.00568, 0.00871, -0.02656, 0.01582,
		0.00875, -0.02114,
		0.00464, -0.01075,
		9.08966, 1.37810, 3.44548, -27.44651,
		-59.62749, -0.73611, -0.77613, 65.72607,
		-0.00664, -0.00723,
		1.04214, 4.78920, 11.67397, -1.84524,
		-4.16685, -19.14211, -16.14483, 3.02496,
		-1.98140, 1.16261, 1.81526, 4.21224,
		5.59020, -2.55741, -1.54151, -3.85817,
		-1.08723, 1.23372, 1.12378, 1.51554,
		0.88937, -0.57631,
		-0.50549, -0.25617, -0.37618, 0.42163,
		0.18902, 0.19575,
		-0.15402, -0.04062, -0.04017, 0.05717,
		-0.01665, -0.00199
	],
	rad_tbl: [
		-8.30490, -11.68232, 86.54880, 4361.05018,
		0.00002, -0.00001,
		-0.01102, 0.00410, 0.00007, -0.00276,
		0.00117, 0.00082,
		0.00049, 0.00007, 0.00003, -0.00001,
		0.00012, 0.00005,
		-0.00186, -0.00534,
		-0.03301, 0.01808,
		0.00008, 0.00005,
		-0.00394, 0.00202, 0.02362, -0.00359,
		0.00638, -0.06767,
		0.00422, -0.00493, 0.00660, 0.00513,
		-0.00417, 0.00708,
		0.05849, -0.00213, -0.07647, -0.16162,
		-0.30551, 0.13856,
		-0.02789, 0.01811, -0.04155, -0.06229,
		0.05729, -0.03694,
		-0.03087, 0.01610,
		-0.00297, -0.00167, 0.00041, -0.00157,
		-0.00115, 0.00058,
		0.00796, 0.00436, -0.01393, 0.02921,
		-0.05902, -0.02363,
		0.00459, -0.01512, 0.10038, 0.02964,
		-0.08369, 0.34570,
		-0.00749, -0.02653,
		0.01361, -0.00326, 0.00406, 0.00952,
		-0.00594, -0.00829,
		-0.02763, -0.09933,
		-0.04143, 0.05152, -0.08436, -0.05294,
		-0.00329, -0.00016,
		-0.04340, 0.02566,
		-0.03027, 0.10904,
		0.03665, -0.03070,
		0.23525, 0.00182,
		0.03092, -0.02212,
		0.01255, 0.00777,
		-0.01025, 0.00042,
		-0.00065, 0.00440,
		0.08688, 0.00136,
		0.05700, -0.03616, -0.11272, -0.20838,
		-0.37048, 0.18314,
		0.00717, -0.02911, 0.15848, 0.05266,
		-0.13451, 0.51639,
		0.00688, 0.02029,
		0.00596, 0.00423,
		-0.00253, 0.01196,
		0.05264, -0.03301, 0.10669, 0.07558,
		-0.02461, 0.16282,
		-0.18481, -0.57118, 0.85303, -0.44876,
		0.37090, 0.65915,
		-0.00458, 0.00660,
		0.41186, 0.09829, -0.31999, 1.51149,
		-0.00052, -0.00809,
		0.01384, -0.07114,
		-0.00435, -0.03237, 0.02162, 0.00294,
		0.29742, -0.15430,
		-0.04508, 0.17436,
		0.01577, 0.00485,
		-0.00258, 0.00946,
		0.00061, 0.00119,
		0.01095, -0.00788,
		0.00530, -0.01478,
		2885.06380, 2152.76256, 2361.91098, 1442.28586,
		602.45147, 251.18991, -121.68155, 71.20167,
		404.94753, 1607.37580, 11211.04090, -2905.37340,
		-9066.27933, -40747.62807,
		-0.00189, 0.00957,
		0.00332, 0.00907,
		0.00574, -0.01255,
		-0.01134, 0.00291,
		-0.00666, -0.00615,
		-0.04947, 0.06182, 0.03965, 0.08091,
		0.06846, -0.03612, 0.13966, 0.12543,
		-0.05494, -0.05043,
		-0.24454, -0.20507, 0.56201, -0.75997,
		1.15728, 0.76203,
		-0.00559, -0.00536,
		0.01872, 0.00104,
		0.03044, 0.02504,
		-1.07241, -0.00288,
		0.00950, -0.00760,
		-0.03211, 0.02261,
		0.02678, -0.06868,
		0.03008, -0.02062,
		0.04997, -0.15164,
		-0.00176, -0.00580,
		-0.00730, -0.00676,
		-0.13906, -0.00089,
		-0.00362, 0.00817,
		0.02021, 0.07719,
		0.02788, 0.02061,
		-0.00274, 0.00016,
		0.00566, 0.02293,
		0.04691, -0.05005, -0.05095, -0.06225,
		-0.19770, -0.00456,
		-0.00848, 0.00595,
		-0.04506, -0.00172,
		-0.01960, 0.22971, 0.14459, 0.04362,
		-0.40199, 0.00386,
		0.01442, -0.00088,
		-0.00020, 0.00544,
		0.04768, 0.05222,
		-0.04069, -0.00003,
		15.71084, -12.28846, -66.23443, -109.83758,
		-586.31996, 311.09606, 1070.75040, 2094.34080,
		3839.04103, -1797.34193,
		-0.01216, 0.01244,
		-0.01666, 0.02627,
		0.00687, -0.01291,
		0.00939, -0.01905, 0.09401, 0.05027,
		-0.09398, 0.23942,
		-0.00379, 0.00834,
		0.05632, -0.01907, -0.04654, -0.21243,
		0.00255, 0.00179,
		0.00540, 0.00497,
		0.01427, 0.00243,
		-0.00697, -0.02792,
		-0.01524, 0.00810,
		-0.00461, 0.00238,
		0.00899, -0.01515,
		-0.01011, -0.04390,
		-0.00447, -0.00992,
		-0.06110, 0.00975, -0.00261, 0.03415,
		-0.02336, -0.08776,
		-0.00883, 0.01346,
		-0.00229, -0.00895,
		42.18049, -48.21316, -148.61588, -171.57236,
		-414.27195, 343.09118, 394.59044, 511.79914,
		-0.00911, -0.00220,
		-0.06315, -0.00988,
		0.04357, -0.02389,
		0.00004, 0.00232,
		0.00581, -0.00317,
		0.00948, -0.00497,
		-0.00734, 0.00300,
		0.01883, -0.01055,
		-0.00365, -0.00126,
		24.18074, 12.28004, 43.18187, -58.69806,
		-102.40566, -79.48349, -74.81060, 89.71332,
		0.00241, -0.00135, -0.00136, -0.01617,
		0.00818, 0.00873,
		0.00368, 0.00383,
		-2.25893, 10.18542, 20.73104, 9.07389,
		13.73458, -29.10491, -20.62071, -10.63404,
		0.00382, -0.00143,
		-3.77385, 0.12725, -1.30842, 6.75795,
		7.94463, 1.79092, 1.24458, -4.73211,
		-0.36978, -1.25710, -2.06373, 0.06194,
		-0.00509, 2.08851, 1.07491, 0.04112,
		-0.28582, -0.51413, -0.53312, 0.11936,
		0.04447, 0.23945,
		0.12450, -0.11821, -0.06100, -0.12924,
		-0.05193, 0.02219,
		0.01977, -0.02933, -0.00771, -0.01077,
		0.00109, -0.00273
	],
	arg_tbl: [
		0, 3,
		3, 1, 1, -10, 3, 11, 4, 0,
		2, 2, 5, -5, 6, 2,
		3, 5, 1, -14, 2, 2, 3, 1,
		3, 1, 1, -5, 2, 4, 3, 0,
		1, 1, 6, 0,
		1, 2, 6, 0,
		3, 2, 1, -7, 2, 3, 3, 0,
		1, 1, 5, 2,
		2, 1, 1, -4, 3, 2,
		1, 2, 5, 2,
		2, 2, 1, -5, 2, 2,
		1, 3, 5, 0,
		2, 4, 1, -10, 2, 1,
		2, 3, 1, -8, 2, 0,
		2, 1, 1, -3, 2, 2,
		2, 1, 1, -2, 2, 2,
		1, 1, 3, 0,
		2, 3, 1, -7, 2, 1,
		2, 1, 1, -3, 3, 0,
		1, 1, 2, 0,
		2, 2, 1, -4, 2, 1,
		2, 4, 1, -9, 2, 0,
		1, 2, 3, 0,
		2, 1, 1, -2, 3, 0,
		2, 1, 1, -4, 2, 0,
		2, 1, 1, -1, 2, 0,
		2, 3, 1, -6, 2, 0,
		1, 3, 3, 0,
		2, 2, 1, -7, 2, 0,
		2, 1, 1, -2, 4, 0,
		2, 1, 1, -1, 3, 0,
		1, 2, 2, 2,
		2, 2, 1, -3, 2, 2,
		2, 4, 1, -8, 2, 0,
		2, 3, 1, -10, 2, 0,
		2, 1, 1, -4, 5, 0,
		2, 1, 1, -3, 5, 2,
		2, 1, 1, -5, 2, 2,
		2, 1, 1, -5, 6, 0,
		2, 1, 1, -2, 5, 1,
		3, 1, 1, -4, 5, 5, 6, 0,
		1, 4, 3, 0,
		2, 1, 1, -3, 6, 1,
		2, 1, 1, -1, 5, 0,
		2, 1, 1, -2, 6, 0,
		2, 1, 1, -1, 6, 0,
		2, 1, 1, -2, 7, 0,
		2, 1, 1, -1, 7, 0,
		3, 4, 1, -14, 2, 2, 3, 0,
		3, 1, 1, 2, 5, -5, 6, 0,
		1, 1, 1, 6,
		3, 2, 1, -10, 3, 11, 4, 0,
		3, 1, 1, -2, 5, 5, 6, 0,
		3, 6, 1, -14, 2, 2, 3, 0,
		2, 1, 1, 1, 6, 0,
		2, 1, 1, 2, 6, 0,
		2, 1, 1, 1, 5, 1,
		2, 2, 1, -4, 3, 1,
		2, 1, 1, 2, 5, 0,
		2, 3, 1, -5, 2, 2,
		2, 1, 1, 3, 5, 0,
		2, 5, 1, -10, 2, 0,
		1, 3, 2, 0,
		2, 2, 1, -2, 2, 0,
		2, 1, 1, 1, 3, 0,
		2, 4, 1, -7, 2, 0,
		2, 2, 1, -3, 3, 0,
		2, 1, 1, 1, 2, 0,
		2, 3, 1, -4, 2, 0,
		2, 5, 1, -9, 2, 0,
		2, 1, 1, 2, 3, 0,
		2, 2, 1, -2, 3, 0,
		1, 4, 2, 0,
		2, 2, 1, -1, 2, 0,
		2, 4, 1, -6, 2, 0,
		2, 2, 1, -2, 4, 0,
		2, 2, 1, -1, 3, 0,
		2, 1, 1, 2, 2, 1,
		2, 3, 1, -3, 2, 0,
		2, 5, 1, -8, 2, 0,
		2, 2, 1, -3, 5, 0,
		1, 5, 2, 1,
		2, 2, 1, -2, 5, 0,
		2, 1, 1, 4, 3, 0,
		2, 2, 1, -3, 6, 0,
		2, 2, 1, -1, 5, 0,
		2, 2, 1, -2, 6, 0,
		1, 2, 1, 4,
		2, 2, 1, 1, 5, 0,
		2, 3, 1, -4, 3, 0,
		2, 2, 1, 2, 5, 0,
		2, 4, 1, -5, 2, 2,
		2, 1, 1, 3, 2, 0,
		2, 3, 1, -2, 2, 1,
		2, 3, 1, -3, 3, 0,
		2, 2, 1, 1, 2, 0,
		2, 4, 1, -4, 2, 0,
		2, 3, 1, -2, 3, 0,
		2, 3, 1, -1, 2, 0,
		2, 3, 1, -1, 3, 0,
		2, 2, 1, 2, 2, 0,
		2, 4, 1, -3, 2, 0,
		2, 3, 1, -3, 5, 0,
		2, 1, 1, 5, 2, 1,
		2, 3, 1, -2, 5, 0,
		2, 3, 1, -1, 5, 0,
		2, 3, 1, -2, 6, 0,
		1, 3, 1, 3,
		2, 4, 1, -4, 3, 0,
		2, 5, 1, -5, 2, 0,
		2, 4, 1, -2, 2, 0,
		2, 5, 1, -4, 2, 0,
		2, 4, 1, -2, 3, 0,
		2, 5, 1, -3, 2, 0,
		2, 2, 1, 5, 2, 0,
		2, 4, 1, -2, 5, 0,
		2, 4, 1, -1, 5, 0,
		1, 4, 1, 3,
		2, 6, 1, -5, 2, 1,
		2, 5, 1, -2, 2, 0,
		2, 5, 1, -2, 5, 0,
		1, 5, 1, 3,
		2, 7, 1, -5, 2, 0,
		1, 6, 1, 3,
		1, 7, 1, 3,
		1, 8, 1, 2,
		1, 9, 1, 2,
		1, 10, 1, 1,
		1, 11, 1, 0,
		-1
	]
};

// venus.js
$ns.venus = {
	maxargs: 9,
	max_harmonic: [5, 14, 13, 8, 4, 5, 1, 0, 0],
	max_power_of_t: 5,
	distance: 7.2332982000000001e-01,
	timescale: 3652500.0,
	trunclvl: 1.0,
	lon_tbl: [
		9.08078, 55.42416, 21066413644.98911, 655127.20186,
		0.00329, 0.10408,
		0.00268, -0.01908,
		0.00653, 0.00183,
		0.15083, -0.21997,
		6.08596, 2.34841, 3.70668, -0.22740,
		-2.29376, -1.46741,
		-0.03840, 0.01242,
		0.00176, 0.00913,
		0.00121, -0.01222,
		-1.22624, 0.65264, -1.15974, -1.28172,
		1.00656, -0.66266,
		0.01560, -0.00654, 0.00896, 0.00069,
		0.21649, -0.01786,
		0.01239, 0.00255,
		0.00084, -0.06086,
		-0.00041, 0.00887,
		0.13453, -0.20013, 0.08234, 0.01575,
		0.00658, -0.00214,
		0.00254, 0.00857,
		-0.01047, -0.00519,
		0.63215, -0.40914, 0.34271, -1.53258,
		0.00038, -0.01437,
		-0.02599, -2.27805, -0.36873, -1.01799,
		-0.36798, 1.41356,
		-0.08167, 0.01368, 0.20676, 0.06807,
		0.02282, -0.04691,
		0.30308, -0.20218, 0.24785, 0.27522,
		0.00197, -0.00499,
		1.43909, -0.46154, 0.93459, 2.99583,
		-3.43274, 0.05672,
		-0.06586, 0.12467, 0.02505, -0.08433,
		0.00743, 0.00174,
		-0.04013, 0.17715,
		-0.00603, -0.01024,
		0.01542, -0.02378,
		0.00676, 0.00002,
		-0.00168, -4.89487,
		0.02393, -0.03064,
		0.00090, 0.00977,
		0.01223, 0.00381,
		0.28135, -0.09158, 0.18550, 0.58372,
		-0.67437, 0.01409,
		-0.25404, -0.06863,
		0.06763, -0.02939,
		-0.00009, -0.04888,
		0.01718, -0.00978,
		-0.01945, 0.08847,
		-0.00135, -11.29920,
		0.01689, -0.04756,
		0.02075, -0.01667,
		0.01397, 0.00443,
		-0.28437, 0.07600, 0.17996, -0.44326,
		0.29356, 1.41869, -1.58617, 0.03206,
		0.00229, -0.00753,
		-0.03076, -2.96766,
		0.00245, 0.00697,
		0.01063, -0.02468,
		-0.00351, -0.18179,
		-0.01088, 0.00380,
		0.00496, 0.02072,
		-0.12890, 0.16719, -0.06820, -0.03234,
		-60.36135, -11.74485, -11.03752, -3.80145,
		-21.33955, -284.54495, -763.43839, 248.50823,
		1493.02775, 1288.79621, -2091.10921, -1851.15420,
		-0.00922, 0.06233,
		0.00004, 0.00785,
		0.10363, -0.16770, 0.45497, 0.24051,
		-0.28057, 0.61126,
		-0.02057, 0.00010,
		0.00561, 0.01994,
		0.01416, -0.00442,
		0.03073, -0.14961,
		-0.06272, 0.08301,
		0.02040, 7.12824,
		-0.00453, -0.01815,
		0.00004, -0.00013,
		-0.03593, -0.18147, 0.20353, -0.00683,
		0.00003, 0.06226,
		-0.00443, 0.00257,
		0.03194, 0.03254,
		0.00282, -0.01401,
		0.00422, 1.03169,
		-0.00169, -0.00591,
		-0.00307, 0.00540,
		0.05511, 0.00347,
		0.07896, 0.06583,
		0.00783, 0.01926,
		0.03109, 0.15967,
		0.00343, 0.88734,
		0.01047, 0.32054,
		0.00814, 0.00051,
		0.02474, 0.00047,
		0.00052, 0.03763,
		-57.06618, 20.34614, -45.06541, -115.20465,
		136.46887, -84.67046, 92.93308, 160.44644,
		-0.00020, -0.00082,
		0.02496, 0.00279,
		0.00849, 0.00195,
		-0.05013, -0.04331,
		-0.00136, 0.14491,
		-0.00183, -0.00406,
		0.01163, 0.00093,
		-0.00604, -0.00680,
		-0.00036, 0.06861,
		-0.00450, -0.00969,
		0.00171, 0.00979,
		-0.00152, 0.03929,
		0.00631, 0.00048,
		-0.00709, -0.00864,
		1.51002, -0.24657, 1.27338, 2.64699,
		-2.40990, -0.57413,
		-0.00023, 0.03528,
		0.00268, 0.00522,
		-0.00010, 0.01933,
		-0.00006, 0.01100,
		0.06313, -0.09939, 0.08571, 0.03206,
		-0.00004, 0.00645
	],
	lat_tbl: [
		-23.91858, 31.44154, 25.93273, -67.68643,
		-0.00171, 0.00123,
		0.00001, -0.00018,
		-0.00005, 0.00018,
		-0.00001, 0.00019,
		0.00733, 0.00030, -0.00038, 0.00011,
		0.00181, 0.00120,
		0.00010, 0.00002,
		-0.00012, 0.00002,
		0.00021, 0.00004,
		-0.00403, 0.00101, 0.00342, -0.00328,
		0.01564, 0.01212,
		0.00011, 0.00010, -0.00002, -0.00004,
		-0.00524, 0.00079,
		0.00011, 0.00002,
		-0.00001, 0.00003,
		0.00001, 0.00000,
		0.00108, 0.00035, 0.00003, 0.00064,
		-0.00000, -0.00002,
		-0.00069, 0.00031,
		0.00020, 0.00003,
		0.00768, 0.03697, -0.07906, 0.01673,
		-0.00003, -0.00001,
		-0.00198, -0.01045, 0.01761, -0.00803,
		-0.00751, 0.04199,
		0.00280, -0.00213, -0.00482, -0.00209,
		-0.01077, 0.00715,
		0.00048, -0.00004, 0.00199, 0.00237,
		0.00017, -0.00032,
		-0.07513, -0.00658, -0.04213, 0.16065,
		0.27661, 0.06515,
		0.02156, -0.08144, -0.23994, -0.05674,
		0.00167, 0.00069,
		0.00244, -0.01247,
		-0.00100, 0.00036,
		0.00240, 0.00012,
		0.00010, 0.00018,
		0.00208, -0.00098,
		-0.00217, 0.00707,
		-0.00338, 0.01260,
		-0.00127, -0.00039,
		-0.03516, -0.00544, -0.01746, 0.08258,
		0.10633, 0.02523,
		0.00077, -0.00214,
		-0.02335, 0.00976,
		-0.00019, 0.00003,
		0.00041, 0.00039,
		0.00199, -0.01098,
		0.00813, -0.00853,
		0.02230, 0.00349,
		-0.02250, 0.08119,
		-0.00214, -0.00052,
		-0.00220, 0.15216, 0.17152, 0.08051,
		-0.01561, 0.27727, 0.25837, 0.07021,
		-0.00005, -0.00000,
		-0.02692, -0.00047,
		-0.00007, -0.00016,
		0.01072, 0.01418,
		-0.00076, 0.00379,
		-0.00807, 0.03463,
		-0.05199, 0.06680,
		-0.00622, 0.00787, 0.00672, 0.00453,
		-10.69951, -67.43445, -183.55956, -37.87932,
		-102.30497, -780.40465, 2572.21990, -446.97798,
		1665.42632, 5698.61327, -11889.66501, 2814.93799,
		0.03204, -0.09479,
		0.00014, -0.00001,
		-0.04118, -0.04562, 0.03435, -0.05878,
		0.01700, 0.02566,
		-0.00121, 0.00170,
		0.02390, 0.00403,
		0.04629, 0.01896,
		-0.00521, 0.03215,
		-0.01051, 0.00696,
		-0.01332, -0.08937,
		-0.00469, -0.00751,
		0.00016, -0.00035,
		0.00492, -0.03930, -0.04742, -0.01013,
		0.00065, 0.00021,
		-0.00006, 0.00017,
		0.06768, -0.01558,
		-0.00055, 0.00322,
		-0.00287, -0.01656,
		0.00061, -0.00041,
		0.00030, 0.00047,
		-0.01436, -0.00148,
		0.30302, -0.05511,
		-0.00020, -0.00005,
		0.00042, -0.00025,
		0.01270, 0.00458,
		-0.00593, -0.04480,
		0.00005, -0.00008,
		0.08457, -0.01569,
		0.00062, 0.00018,
		9.79942, -2.48836, 4.17423, 6.72044,
		-63.33456, 34.63597, 39.11878, -72.89581,
		-0.00066, 0.00036,
		-0.00045, -0.00062,
		-0.00287, -0.00118,
		-0.21879, 0.03947,
		0.00086, 0.00671,
		-0.00113, 0.00122,
		-0.00193, -0.00029,
		-0.03612, 0.00635,
		0.00024, 0.00207,
		-0.00273, 0.00443,
		-0.00055, 0.00030,
		-0.00451, 0.00175,
		-0.00110, -0.00015,
		-0.02608, 0.00480,
		2.16555, -0.70419, 1.74648, 0.97514,
		-1.15360, 1.73688,
		0.00004, 0.00105,
		0.00187, -0.00311,
		0.00005, 0.00055,
		0.00004, 0.00032,
		-0.04629, 0.02292, -0.00363, -0.03807,
		0.00002, 0.00020
	],
	rad_tbl: [
		-0.24459, 3.72698, -6.67281, 5.24378,
		0.00030, 0.00003,
		-0.00002, -0.00000,
		-0.00000, 0.00001,
		0.00032, 0.00021,
		-0.00326, 0.01002, 0.00067, 0.00653,
		0.00243, -0.00417,
		-0.00004, -0.00010,
		-0.00002, -0.00001,
		0.00004, -0.00002,
		-0.00638, -0.01453, 0.01458, -0.01235,
		0.00755, 0.01030,
		0.00006, 0.00014, 0.00000, 0.00009,
		0.00063, 0.00176,
		0.00003, -0.00022,
		0.00112, 0.00001,
		-0.00014, -0.00001,
		0.00485, 0.00322, -0.00035, 0.00198,
		0.00004, 0.00013,
		-0.00015, -0.00003,
		0.00011, -0.00025,
		0.00634, 0.02207, 0.04620, 0.00160,
		0.00045, 0.00001,
		-0.11563, 0.00643, -0.05947, 0.02018,
		0.07704, 0.01574,
		-0.00090, -0.00471, -0.00322, 0.01104,
		0.00265, -0.00038,
		0.01395, 0.02165, -0.01948, 0.01713,
		-0.00057, -0.00019,
		0.04889, 0.13403, -0.28327, 0.10597,
		-0.02325, -0.35829,
		0.01171, -0.00904, 0.00747, 0.02546,
		0.00029, -0.00190,
		-0.03408, -0.00703,
		0.00176, -0.00109,
		0.00463, 0.00293,
		0.00000, 0.00148,
		1.06691, -0.00054,
		-0.00935, -0.00790,
		0.00552, -0.00084,
		-0.00100, 0.00336,
		0.02874, 0.08604, -0.17876, 0.05973,
		-0.00720, -0.21195,
		0.02134, -0.07980,
		0.01500, 0.01398,
		0.01758, -0.00004,
		0.00371, 0.00650,
		-0.03375, -0.00723,
		4.65465, -0.00040,
		0.02040, 0.00707,
		-0.00727, -0.01144,
		-0.00196, 0.00620,
		-0.03396, -0.12904, 0.20160, 0.08092,
		-0.67045, 0.14014, -0.01571, -0.75141,
		0.00361, 0.00110,
		1.42165, -0.01499,
		-0.00334, 0.00117,
		0.01187, 0.00507,
		0.08935, -0.00174,
		-0.00211, -0.00525,
		0.01035, -0.00252,
		-0.08355, -0.06442, 0.01616, -0.03409,
		5.55241, -30.62428, 2.03824, -6.26978,
		143.07279, -10.24734, -125.25411, -380.85360,
		-644.78411, 745.02852, 926.70000, -1045.09820,
		-0.03124, -0.00465,
		-0.00396, 0.00002,
		0.08518, 0.05248, -0.12178, 0.23023,
		-0.30943, -0.14208,
		-0.00005, -0.01054,
		-0.00894, 0.00233,
		-0.00173, -0.00768,
		0.07881, 0.01633,
		-0.04463, -0.03347,
		-3.92991, 0.00945,
		0.01524, -0.00422,
		-0.00011, -0.00005,
		0.10842, -0.02126, 0.00349, 0.12097,
		-0.03752, 0.00001,
		-0.00156, -0.00270,
		-0.01520, 0.01349,
		0.00895, 0.00186,
		-0.67751, 0.00180,
		0.00516, -0.00151,
		-0.00365, -0.00210,
		-0.00276, 0.03793,
		-0.02637, 0.03235,
		-0.01343, 0.00541,
		-0.11270, 0.02169,
		-0.63365, 0.00122,
		-0.24329, 0.00428,
		-0.00040, 0.00586,
		0.00581, 0.01112,
		-0.02731, 0.00008,
		-2.69091, 0.42729, 2.78805, 3.43849,
		-0.87998, -6.62373, 0.56882, 4.69370,
		0.00005, -0.00008,
		-0.00181, 0.01767,
		-0.00168, 0.00660,
		0.01802, -0.01836,
		-0.11245, -0.00061,
		0.00199, -0.00070,
		-0.00076, 0.00919,
		0.00311, -0.00165,
		-0.05650, -0.00018,
		0.00121, -0.00069,
		-0.00803, 0.00146,
		-0.03260, -0.00072,
		-0.00042, 0.00524,
		0.00464, -0.00339,
		-0.06203, -0.00278, 0.04145, 0.02871,
		-0.01962, -0.01362,
		-0.03040, -0.00010,
		0.00085, -0.00001,
		-0.01712, -0.00006,
		-0.00996, -0.00003,
		-0.00029, 0.00026, 0.00016, -0.00005,
		-0.00594, -0.00003
	],
	arg_tbl: [
		0, 3,
		2, 2, 5, -5, 6, 0,
		3, 2, 2, 1, 3, -8, 4, 0,
		3, 5, 1, -14, 2, 2, 3, 0,
		3, 3, 2, -7, 3, 4, 4, 0,
		2, 8, 2, -13, 3, 2,
		3, 6, 2, -10, 3, 3, 5, 0,
		1, 1, 7, 0,
		2, 1, 5, -2, 6, 0,
		2, 1, 2, -3, 4, 2,
		2, 2, 5, -4, 6, 1,
		1, 1, 6, 0,
		3, 3, 2, -5, 3, 1, 5, 0,
		3, 3, 2, -5, 3, 2, 5, 0,
		2, 1, 5, -1, 6, 0,
		2, 2, 2, -6, 4, 1,
		2, 2, 5, -3, 6, 0,
		1, 2, 6, 0,
		2, 3, 5, -5, 6, 0,
		1, 1, 5, 1,
		2, 2, 5, -2, 6, 0,
		2, 3, 2, -5, 3, 2,
		2, 5, 2, -8, 3, 1,
		1, 2, 5, 0,
		2, 2, 1, -5, 2, 1,
		2, 6, 2, -10, 3, 0,
		2, 2, 2, -3, 3, 2,
		2, 1, 2, -2, 3, 1,
		2, 4, 2, -7, 3, 0,
		2, 4, 2, -6, 3, 0,
		1, 1, 4, 0,
		2, 1, 2, -2, 4, 0,
		2, 2, 2, -5, 4, 0,
		2, 1, 2, -1, 3, 0,
		2, 1, 1, -3, 2, 0,
		2, 2, 2, -4, 3, 0,
		2, 6, 2, -9, 3, 0,
		2, 3, 2, -4, 3, 2,
		2, 1, 1, -2, 2, 0,
		1, 1, 3, 0,
		2, 1, 2, -1, 4, 0,
		2, 2, 2, -4, 4, 0,
		2, 5, 2, -7, 3, 0,
		2, 2, 2, -2, 3, 0,
		2, 1, 2, -3, 5, 0,
		2, 1, 2, -3, 3, 0,
		2, 7, 2, -10, 3, 0,
		2, 1, 2, -2, 5, 1,
		2, 4, 2, -5, 3, 1,
		3, 1, 2, 1, 5, -5, 6, 0,
		2, 1, 2, -1, 5, 0,
		3, 1, 2, -3, 5, 5, 6, 0,
		2, 1, 2, -2, 6, 0,
		2, 1, 2, -1, 6, 0,
		1, 3, 4, 0,
		2, 7, 2, -13, 3, 0,
		3, 1, 2, 2, 5, -5, 6, 1,
		1, 1, 2, 5,
		2, 9, 2, -13, 3, 0,
		3, 1, 2, 1, 5, -2, 6, 0,
		2, 2, 2, -3, 4, 2,
		2, 3, 2, -6, 4, 0,
		2, 1, 2, 1, 5, 0,
		2, 2, 2, -5, 3, 0,
		2, 6, 2, -8, 3, 0,
		2, 2, 1, -4, 2, 0,
		2, 3, 2, -3, 3, 0,
		1, 2, 3, 0,
		2, 3, 2, -7, 3, 0,
		2, 5, 2, -6, 3, 1,
		2, 2, 2, -2, 4, 0,
		2, 3, 2, -5, 4, 0,
		2, 2, 2, -1, 3, 0,
		2, 7, 2, -9, 3, 0,
		2, 4, 2, -4, 3, 0,
		2, 1, 2, 1, 3, 0,
		2, 3, 2, -4, 4, 0,
		2, 6, 2, -7, 3, 0,
		2, 3, 2, -2, 3, 0,
		2, 2, 2, -4, 5, 0,
		2, 2, 2, -3, 5, 0,
		2, 2, 2, -2, 5, 0,
		2, 5, 2, -5, 3, 0,
		2, 2, 2, -3, 6, 0,
		2, 2, 2, -1, 5, 0,
		2, 2, 2, -2, 6, 0,
		1, 2, 2, 3,
		2, 2, 2, 1, 5, 0,
		2, 7, 2, -8, 3, 0,
		2, 2, 1, -3, 2, 0,
		2, 4, 2, -3, 3, 0,
		2, 6, 2, -6, 3, 0,
		2, 3, 2, -1, 3, 0,
		2, 8, 2, -9, 3, 0,
		2, 5, 2, -4, 3, 0,
		2, 7, 2, -7, 3, 0,
		2, 4, 2, -2, 3, 0,
		2, 3, 2, -4, 5, 0,
		2, 3, 2, -3, 5, 0,
		2, 9, 2, -10, 3, 0,
		2, 3, 2, -2, 5, 0,
		1, 3, 2, 2,
		2, 8, 2, -8, 3, 0,
		2, 5, 2, -3, 3, 0,
		2, 9, 2, -9, 3, 0,
		2, 10, 2, -10, 3, 0,
		1, 4, 2, 1,
		2, 11, 2, -11, 3, 0,
		-1
	]
};

// earth.js
$ns.earth = {
	maxargs: 12,
	max_harmonic: [2, 11, 14, 19,  6, 10,  2,  2,  0,  1,  1,  4,  0,  0,  0,  0,  0,  0],
	max_power_of_t: 3,
	distance: 1.0001398729597080e+00,
	timescale: 3.6525000000000000e+06,
	trunclvl: 1.0000000000000000e-04,
	lon_tbl: [
		-242809, -178223, -6154, -6547,
		15526, -79460, 66185, -19531,
		-12754, 4389, 3153, -1151,
		768, 1750,
		-248, 657, -80, 0,
		-4, -29,
		-3020, 301, -360, 412,
		-1463, 2266,
		-41, 30,
		-39868, -14275, -25052, 1583,
		15695, 10018,
		-113, -122,
		-243, 18, -33, 31,
		-134, -171, 243, -115,
		18, 148,
		-120, -129, 19, -220,
		-30, 19,
		8, 23,
		-162, -124, 189, -315,
		73, 77,
		32006, -11295, 11595, 5629,
		-838, 1728,
		0, 4,
		38, 15,
		142, -228, 92, 32,
		-2274, -1500, -2277, 3143,
		3204, 127,
		-20, -11,
		5186, 1054, 996, 1769,
		-231, 163,
		-88, -19,
		-2, -145,
		-27, 48,
		-8, 421,
		-7, 148,
		-16, -2,
		-3964, 4259, -11192, -8385,
		11513, -13415,
		103, -43,
		-289, -79, -29, 163,
		-117, 559, -190, -15,
		7108, 5345, 12933, -7709,
		3485, -26023,
		11, -5,
		311, 78, 22, 76,
		2846, -3922, 2329, 43,
		34, 442,
		3, -245,
		-5, -3,
		-17, 5,
		318, 15963, 2520, 7115,
		2548, -9836,
		-7063, 1950, -4471, -8326,
		4964, -3101,
		563, -80, -1444, -472,
		8, -22,
		1558, -88, 235, 359,
		293, -16, 144, 209,
		-13, -7,
		812, -744, 150, -740,
		-2569, -956, 69, -2475,
		1009, -55,
		-1707, -2525, 1071, -1761,
		550, 279,
		-14, 36,
		-10442, 3344, -6759, -21551,
		24737, -434,
		504, -385, 191, 96,
		-2760, -1068, 85, -2617,
		1062, -43,
		192, -16, 30, 42,
		-2446, 588, -1522, -2933,
		1746, -1070,
		511, -1401, 139, 729,
		-12, 29,
		-2618, -2076, 2079, -3711,
		-21, -2727,
		-80, -19,
		113, 2420, 325, 1058,
		379, -1478,
		296, -251, -265, -409,
		-10, 20,
		15, -15,
		11, 143, -83, 19,
		266, -17, 40, 59,
		19, -105, 5, 48331,
		21, -16,
		-97, -318, 158, -171,
		456, -351, 168, 85,
		12, -2,
		20, -15,
		15, 2,
		385, -1125, 521, -23,
		-815, -2088, 1644, -1329,
		7, 14,
		-582, 234, -67, -467,
		-167, -51,
		-684, -2302, 1315, -797,
		6, -70,
		-118, -406, 67, -63,
		-4848, 3713, -8483, -8776,
		13049, -9404,
		-23, 34,
		-12, 1,
		-24, -10,
		-21, 0,
		-1, 24,
		-3, 28,
		-3032, -2494, 2498, -4342,
		-6538, 1899, -4414, -13249,
		15540, -292,
		-228, 176, -40, -161,
		-20, -36,
		-800, -172, -36, -208,
		-249, -374, -1410, -72118,
		-745, 213, -23, 196,
		-14, -2,
		-239, -341, 1015, -291,
		33, -94, 90, -20431,
		4, -39,
		75, 216, -23, 41,
		116, 24, 5, 26,
		-45, -4178,
		-9, -23,
		12, 18,
		68, -2,
		36, -19,
		42, -8,
		6, -106,
		4, -38,
		-73, 259, 107, -293,
		-12, -44, 37, 13,
		73, -46, 17, 8,
		5832, 1989, -1404, 4469,
		-1619, -743,
		-1796, -2206, 461, -291,
		153, 1104,
		19195, 652503, 5587, -5252787,
		47, -17340051, -32, 68926621,
		1054, -230, -1601, 356,
		-562, -998,
		124, -446, -171, 66,
		26, 60,
		-7, 0,
		-88, -43, 65, -400,
		4, 183,
		-1014, 2043, -1076, 126,
		-41, -205,
		-127, -85, -15, 68,
		0, 0,
		-320, 75, -42, 285,
		-303, 771, 616, 400,
		-470, 48, -76, -103,
		-190, -11,
		-139, -5, -48, -87,
		-22, -362, -271, 1233,
		-392, 353, -154, -71,
		-109, 112,
		17, 8,
		1, -17,
		-170, 623, -279, 21,
		139, -151, -107, -55199,
		588, -188, 397, 674,
		-406, 269,
		166, -207, 585, 333,
		-386, 754,
		29, -65,
		35, 10,
		63, 1291,
		62, 8,
		239, 1323, -1434, 53,
		19, -1,
		34, 82,
		-15, -16,
		265, -338, -729, -207,
		3, 17,
		697, 399, 274, 760,
		-12, 2,
		-48, -9,
		3, 64,
		147, 36, 9, 46,
		77, 144, -76, 65,
		2329, 1763, 987, 5506,
		66, -123, -41, -24,
		-12, 1,
		-19, 94,
		19, 8,
		-1, -18,
		142, 77, -78, 187,
		6, 18,
		607, 163, 17, 158,
		27, -208, 154, 27317,
		587, -143, 22, -153,
		5, -34,
		75, 330,
		98, -128, -67, -6542,
		-115, -236, 217, -12,
		10, -6,
		-250, 653, 1611, -209,
		4, 1072,
		-129, 216, 402, 81,
		117, 11,
		0, 20,
		24, -28,
		245, 437, -16, 59,
		527952, -74895, 169682, 177186,
		-376, -362869, -60, 719658,
		-151, -382, -22, -43,
		5, -5,
		14, 5,
		-9, 13,
		83, 296, -369, -1,
		-14, -6,
		42, 8,
		-31, 7,
		-354, 634, 1132, 243,
		-38, 42,
		-14, 68,
		-6, 31,
		-36, -13,
		7, -2104,
		16, 67,
		9, -4,
		174, 144, 58, 438,
		-15, 5,
		-16, 19,
		-135, 1642,
		-140, -11,
		-4, 27,
		253, -382, -651, -221,
		11, 1,
		-12, -6,
		136, 23,
		-1, 43,
		3, 38,
		-26, -5,
		17864, -4244, 5704, 7754,
		-36, -7891, -3, 10418,
		2, -844,
		-1, 126,
		-7, 32,
		-67, -5,
		39, 10,
		5, 52,
		-13, 159,
		-49, -21,
		1, -394,
		7, -15,
		-4, -245, 1, 172,
		-36, -3,
		13, 5,
		0, 1,
		-1, 0, 0, -202,
		-2, 19,
		-20, -2,
		5, 3,
		0, -110,
		-12, -1,
		0, -62,
		0, -36,
		0, -22,
		-13, 3
	],
	lat_tbl: [
		-428091, -488399, 746850, 6,
		210, -93, 32, 1,
		-365, 332, -105, 76,
		-7, 2,
		-8, 14, -1, 2,
		0, 0,
		-65, 12, -17, 7,
		-1, 1,
		0, 0,
		-15, 65, -4, 26,
		-2, 0,
		0, 0,
		0, 2, 0, 0,
		2, 2, 0, 0,
		0, 0,
		-1, -3, 0, 0,
		0, 0,
		0, 0,
		-2, 0, 0, 0,
		-1, 0,
		-30, 28, -6, 10,
		0, 0,
		0, 0,
		0, 0,
		2, 0, 0, 0,
		-16, 20, -6, -41,
		-9, -3,
		0, 0,
		-6, 2, 2, 0,
		0, 0,
		0, 0,
		0, 0,
		0, 0,
		0, 0,
		0, 0,
		0, 0,
		-96, 33, -12, 228,
		-23, -21,
		0, 0,
		-12, -2, -4, 4,
		-1, 0, 1, 0,
		-329, -22, -34, -726,
		-147, -21,
		0, 0,
		-2, 4, -1, 0,
		2, -7, 0, 1,
		0, 0,
		0, 0,
		0, 0,
		0, 0,
		36, 88, -162, -19,
		-11, 21,
		31, 37, -31, 53,
		-5, -15,
		-3, -11, 9, 3,
		0, 0,
		-2, 0, 1, 0,
		2, -1, 0, 0,
		0, 0,
		-162, -102, -37, 30,
		19, 23, -18, 9,
		1, -6,
		-6, 22, -2, 3,
		1, -2,
		0, -1,
		26, -25, 66, 52,
		-641, -153,
		-13, -9, 2, -3,
		-29, 8, -6, -2,
		0, -6,
		2, -4, 1, 0,
		-26, -11, -1, -10,
		-6, -13,
		66, -1337, -879, -207,
		1, -1,
		8, -30, -24, -18,
		-16, 1,
		9, 1,
		-24, -8, 9, -17,
		-13, 75,
		19, -8, -29, 24,
		0, 0,
		-1, 1,
		-25, 36, -7, -22,
		0, -3, 1, -1,
		187, -46, -6, 74,
		5, -10,
		-5, -4, -16, 10,
		-5, -5, 2, -4,
		5, -2,
		-2, 1,
		-1, 0,
		-16, -12, 1, -13,
		-17, -111, -186, 73,
		-1, -2,
		-277, -77, -27, 106,
		16, 5,
		-12, -15, -13, -30,
		-1, 1,
		0, 36, -10, 4,
		607, 262, 533, -1530,
		-1630, 304,
		8, -6,
		1, 1,
		0, -1,
		5, -2,
		0, -1,
		-1, -4,
		-44, -22, -64, -46,
		537, 430, 268, -1553,
		-2040, -486,
		-3, -23, 20, 41,
		-1, 2,
		-21, -4, -1, -3,
		-84, 50, -177, 26,
		5, -12, 2, -4,
		7, 1,
		-115, -305, -310, 138,
		-186, 246, -96, 17,
		0, 0,
		4, -2, 1, 1,
		-3, 2, -1, 0,
		-15, 68,
		0, 2,
		-3, 0,
		-5, 0,
		-1, 1,
		-5, 6,
		0, 0,
		0, 0,
		-235, -98, -2, 2,
		9, -40, -1, -2,
		-33, -9, -5, -4,
		5662, -3849, 1941, -124,
		210, 160,
		-24721, -72945, 4099, -21914,
		1345, -555,
		23637393, -5516830, 17737677, 43330654,
		-44668315, 14540723, -824, -2086,
		-4423, -41801, 5562, -11664,
		960, -125,
		2001, -149, 587, -350,
		23, -52,
		-3, 3,
		-248, -148, -40, 86,
		2, 0,
		21, -82, 11, 8,
		-8, 0,
		-30, -33, -22, 46,
		0, -191,
		-168, -135, 27, -85,
		14, 232, 217, 59,
		5, 12, -5, 2,
		-24, -26,
		-52, 13, -3, 18,
		26, 45, 32, -169,
		14, -6, -3, 4,
		-5, 2,
		6, 2,
		-2, 3,
		20, -15, 0, 10,
		-486, -8, 4, -114,
		102, -188, 23, -67,
		6, 12,
		-43, -1, -32, 2,
		15, 9,
		16, -36,
		-6, -2,
		14, -5,
		17, -15,
		-28, 307, 289, 69,
		2, -7,
		3, -1,
		-1, 1,
		-16, -811, 287, -68,
		0, 0,
		0, -1, 16, -7,
		0, 0,
		0, 2,
		0, 0,
		0, -1, 1, 0,
		-3, -4, 2, 3,
		-29, 34, 59, -15,
		-3, -3, -1, 0,
		-2, -3,
		3, -19,
		0, 0,
		0, 0,
		-15, 1, 5, 2,
		0, 0,
		-1, -5, 0, -1,
		-120, 84, 7, -30,
		-7, -3, -1, 0,
		0, -1,
		9, -6,
		-186, -11, 13, -57,
		1, 4, 1, -1,
		0, 0,
		-5, 796, 46, 5,
		-1, -6,
		-10, 228, 5, -6,
		1, -5,
		0, 0,
		-6, -2,
		148, 137, 10, 28,
		430546, -279834, 488902, 664558,
		-746515, 243112, -39, -37,
		-13, -174, 6, -25,
		2, -3,
		-4, -2,
		0, 4,
		-5, 70, 82, 20,
		0, 1,
		1, 1,
		0, 1,
		-27, 430, 226, -53,
		1, 1,
		0, 1,
		1, -7,
		2, 1,
		-3, -8,
		1, 0,
		-1, 12,
		-2, -5, 4, 0,
		0, 1,
		1, 1,
		1, 9,
		33, 4,
		0, 0,
		0, -321, 4, 1,
		0, 0,
		1, 0,
		106, -22,
		0, 0,
		4, 0,
		0, 2,
		7006, -9443, 12833, 11137,
		-14037, 4575, -2, 0,
		-1, -6,
		1, 1,
		4, 6,
		16, 2,
		55, -10,
		1, 0,
		0, 1,
		0, 2,
		0, -4,
		-2, 0,
		-351, 24, 0, 0,
		8, 1,
		30, -5,
		-12, 10,
		-4, 1, -1, -2,
		0, 0,
		4, 0,
		17, -3,
		0, -2,
		2, 0,
		0, -1,
		0, -1,
		0, 0,
		0, 0
	],
	rad_tbl: [
		14575, -26192, -144864, 2,
		-22, 15, -8, -21,
		-148, -104, -14, -75,
		15, 2,
		-5, -3, -1, 0,
		0, 0,
		0, 21, -2, 7,
		-5, -3,
		0, 0,
		83, -94, 9, -67,
		-29, 50,
		1, -1,
		3, 2, 0, 0,
		4, 3, 1, 1,
		-1, -1,
		0, -1, 2, -1,
		0, 1,
		0, 0,
		-2, 3, -5, -2,
		-1, 1,
		197, 511, -82, 189,
		-28, -12,
		0, 0,
		0, -1,
		6, -1, 0, 1,
		30, -30, -37, -25,
		6, 21,
		0, 0,
		16, -139, 43, -28,
		4, 6,
		0, 3,
		4, 0,
		1, 1,
		-13, 0,
		-4, 0,
		0, 1,
		150, 135, -291, 436,
		-560, -343,
		1, 3,
		8, -15, -13, -5,
		-17, -3, 1, -6,
		-314, 428, 606, 758,
		1230, -411,
		0, -1,
		11, -14, 4, 1,
		221, 157, 1, 132,
		-25, 3,
		12, 0,
		0, 0,
		0, -1,
		1487, -108, 707, -79,
		-950, -190,
		177, 582, -676, 399,
		-281, -396,
		0, 52, 39, -130,
		2, 1,
		12, 148, -34, 23,
		1, 27, -20, 13,
		1, -1,
		198, -34, -21, -80,
		-99, 332, -307, 9,
		-15, -125,
		330, -231, 236, 139,
		-36, 74,
		7, 3,
		-588, -1722, 3623, -1245,
		187, 4366,
		-72, -75, 11, -33,
		174, -467, 444, 9,
		11, 180,
		-6, -39, 8, -7,
		-126, -500, 599, -317,
		224, 355,
		-590, -39, 134, -379,
		-7, -3,
		494, -628, 893, 490,
		712, -7,
		-7, 35,
		-720, 50, -321, 72,
		443, 106,
		74, 82, 112, -84,
		-6, -3,
		5, 4,
		58, 7, -2, 38,
		6, 92, -20, 14,
		33, 13, -11189, -2,
		-11, -8,
		106, -35, 58, 52,
		132, 170, -32, 63,
		-2, -6,
		6, 7,
		-1, 6,
		452, 155, 9, 209,
		788, -318, 511, 616,
		-5, 3,
		142, 303, -280, 32,
		21, -69,
		984, -291, 340, 562,
		30, 2,
		171, -51, 27, 28,
		-1570, -2053, 3702, -3593,
		4012, 5467,
		-14, -9,
		-1, -6,
		4, -11,
		0, -9,
		-11, 0,
		15, 2,
		1133, -1366, 1961, 1134,
		-867, -3010, 6041, -2049,
		142, 7138,
		-79, -103, 73, -18,
		17, -9,
		79, -372, 97, -17,
		182, -118, 33577, -675,
		-99, -347, -91, -11,
		1, -7,
		158, -111, 136, 474,
		50, 16, 9739, 51,
		19, 2,
		-105, 36, -20, -11,
		-12, 56, -13, 2,
		2030, -22,
		11, -4,
		9, -6,
		1, 33,
		10, 18,
		4, 21,
		53, 3,
		19, 2,
		130, 37, -147, -54,
		-22, 6, 7, -19,
		22, 36, -4, 8,
		-949, 2911, -2221, -697,
		371, -808,
		1203, -1117, 191, 189,
		-549, 77,
		-321201, 19788, 2622593, 5990,
		8667033, 114, -34455835, 86,
		-92, -493, 179, 807,
		-499, 281,
		225, 51, -34, -88,
		-30, 13,
		0, -3,
		20, -43, 201, 33,
		-93, 2,
		-1034, -518, -63, -545,
		104, -20,
		43, -64, -34, -7,
		0, 0,
		-61, -159, -143, -8,
		-392, -157, -204, 309,
		-24, -248, 55, -40,
		-6, 91,
		-16, 57, -41, 18,
		197, -20, -668, -150,
		-192, -216, 39, -84,
		-62, -59,
		-4, 8,
		-7, -1,
		-352, -100, -10, -158,
		61, 55, 32493, -49,
		107, 344, -395, 227,
		-154, -238,
		123, 104, -205, 348,
		-449, -236,
		-54, -19,
		-6, 21,
		-790, 27,
		-5, 30,
		-846, 154, -26, -920,
		0, 12,
		-54, 21,
		11, -10,
		137, 132, 109, -337,
		-11, 2,
		-272, 467, -511, 179,
		-1, -8,
		7, -32,
		-44, 2,
		-26, 101, -32, 6,
		-98, 48, -42, -53,
		-1222, 1601, -3775, 656,
		83, 46, 16, -28,
		0, 7,
		-66, -14,
		-6, 13,
		12, 0,
		-58, 91, -123, -58,
		-12, 4,
		-114, 423, -111, 12,
		112, 27, -19072, 71,
		100, 410, 107, 15,
		24, 3,
		-214, 30,
		49, 44, 5017, -27,
		167, -80, 8, 153,
		4, 7,
		-219, -35, 244, 694,
		-762, 2,
		-84, -49, -28, 158,
		-4, 56,
		-14, 0,
		9, 12,
		7, 18, 2, -7,
		-15426, 91, 25800, -15,
		144767, -53, -287824, -24,
		19, -9, 6, 7,
		0, 0,
		-3, 8,
		-5, -3,
		-232, 53, -1, -271,
		4, -12,
		-8, 30,
		-8, -25,
		-253, -150, -105, 470,
		-37, -29,
		-59, -6,
		-24, -5,
		9, -18,
		1784, 3,
		-54, 13,
		-12, 7,
		-116, 144, -353, 52,
		-4, -12,
		-17, -14,
		-1340, -64,
		10, -116,
		-24, -2,
		190, 131, 130, -307,
		-1, 9,
		5, -7,
		-10, 56,
		-33, 0,
		-14, 3,
		2, -12,
		-635, -160, 64, -44,
		2712, -3, -3606, -1,
		774, 1,
		133, -1,
		-19, 0,
		5, -59,
		-5, 14,
		-45, 5,
		-140, -8,
		15, -28,
		379, 1,
		6, 3,
		55, 0, -54, 0,
		3, -33,
		-3, 4,
		0, -4,
		0, -1, 200, 0,
		-17, -1,
		2, -20,
		-2, 0,
		111, 0,
		1, -12,
		64, 0,
		38, 0,
		23, 0,
		3, 13
	],
	arg_tbl: [
		0,  3,
		3,  4,  3, -8,  4,  3,  5,  1,
		2,  2,  5, -5,  6,  2,
		4,  4,  3, -8,  4,  5,  5, -5,  6,  1,
		3,  2,  2,  1,  3, -8,  4,  0,
		3,  3,  2, -7,  3,  4,  4,  2,
		3,  7,  3,-13,  4, -1,  5,  0,
		2,  8,  2,-13,  3,  2,
		3,  1,  3, -2,  4,  2,  6,  0,
		3,  1,  2, -8,  3, 12,  4,  1,
		3,  6,  2,-10,  3,  3,  5,  1,
		1,  1,  7,  0,
		2,  1,  5, -2,  6,  1,
		2,  1,  5, -3,  6,  0,
		3,  1,  3, -2,  4,  1,  5,  0,
		3,  3,  3, -6,  4,  2,  5,  1,
		3,  1,  1, -5,  2,  4,  3,  0,
		2,  8,  3,-15,  4,  2,
		3,  4,  3, -7,  4, -3,  5,  0,
		3,  2,  2, -7,  3,  7,  4,  0,
		2,  2,  5, -4,  6,  1,
		1,  1,  6,  2,
		2,  2,  5, -6,  6,  0,
		2,  9,  3,-17,  4,  2,
		3,  3,  2, -5,  3,  1,  5,  0,
		3,  2,  3, -4,  4,  2,  5,  0,
		3,  2,  3, -4,  4,  1,  5,  0,
		3,  3,  2, -5,  3,  2,  5,  0,
		2,  1,  5, -1,  6,  0,
		3,  3,  2, -6,  3,  2,  4,  0,
		2,  1,  3, -2,  4,  2,
		2,  2,  5, -3,  6,  0,
		1,  2,  6,  1,
		2,  3,  5, -5,  6,  1,
		1,  1,  5,  2,
		3,  4,  3, -8,  4,  2,  5,  0,
		2,  1,  5, -5,  6,  1,
		2,  7,  3,-13,  4,  2,
		2,  2,  5, -2,  6,  0,
		2, 10,  3,-19,  4,  0,
		2,  3,  5, -4,  6,  0,
		2,  3,  2, -5,  3,  2,
		2,  2,  3, -4,  4,  2,
		2,  5,  2, -8,  3,  1,
		2,  3,  5, -3,  6,  0,
		2,  6,  3,-11,  4,  1,
		2,  1,  1, -4,  3,  1,
		2,  4,  5, -5,  6,  0,
		1,  2,  5,  1,
		2,  3,  3, -6,  4,  2,
		2,  5,  3, -9,  4,  2,
		2,  6,  2,-10,  3,  0,
		2,  2,  2, -3,  3,  2,
		2,  4,  3, -8,  4,  1,
		2,  4,  3, -7,  4,  2,
		2,  5,  3,-10,  4,  1,
		2,  3,  3, -5,  4,  2,
		2,  1,  2, -2,  3,  1,
		2,  7,  2,-11,  3,  0,
		2,  2,  3, -3,  4,  1,
		2,  1,  3, -1,  4,  0,
		2,  4,  2, -7,  3,  0,
		2,  4,  2, -6,  3,  2,
		1,  1,  4,  1,
		2,  8,  3,-14,  4,  0,
		2,  1,  3, -5,  5,  0,
		2,  1,  3, -3,  4,  1,
		2,  7,  3,-12,  4,  1,
		2,  1,  2, -1,  3,  1,
		2,  2,  3, -5,  4,  0,
		2,  1,  3, -4,  5,  1,
		2,  6,  3,-10,  4,  1,
		2,  3,  3, -7,  4,  0,
		3,  1,  3, -4,  5,  2,  6,  0,
		3,  1,  3, -1,  5, -5,  6,  0,
		2,  5,  3, -8,  4,  1,
		2,  1,  3, -3,  5,  1,
		3,  1,  3, -5,  5,  5,  6,  0,
		2,  2,  2, -4,  3,  1,
		2,  6,  2, -9,  3,  0,
		2,  4,  3, -6,  4,  1,
		3,  1,  3, -3,  5,  2,  6,  0,
		2,  1,  3, -5,  6,  1,
		2,  1,  3, -2,  5,  2,
		3,  1,  3, -4,  5,  5,  6,  0,
		3,  1,  3, -1,  5, -2,  6,  0,
		3,  1,  3, -3,  5,  3,  6,  0,
		2,  1,  3, -4,  6,  0,
		3,  1,  3, -2,  5,  1,  6,  0,
		2,  5,  2, -9,  3,  0,
		2,  3,  3, -4,  4,  1,
		2,  3,  2, -4,  3,  2,
		2,  1,  3, -3,  6,  1,
		3,  1,  3, -2,  5,  2,  6,  0,
		3,  1,  3,  1,  5, -5,  6,  1,
		2,  1,  3, -1,  5,  1,
		3,  1,  3, -3,  5,  5,  6,  1,
		3,  1,  3,  2,  5, -7,  6,  0,
		2,  1,  3, -2,  6,  1,
		2,  2,  3, -2,  4,  1,
		3,  3,  2, -4,  3,  1,  5,  0,
		2, 10,  3,-17,  4,  1,
		3,  1,  3,  2,  5, -6,  6,  1,
		2,  1,  3, -1,  6,  0,
		3,  1,  3, -2,  5,  4,  6,  0,
		2,  7,  3,-15,  4,  0,
		2,  1,  3, -2,  7,  0,
		3,  1,  3,  1,  5, -3,  6,  0,
		2,  1,  3, -2,  8,  0,
		2,  1,  3, -1,  7,  0,
		2,  1,  3, -1,  8,  0,
		2,  8,  2,-14,  3,  1,
		3,  3,  2, -8,  3,  4,  4,  1,
		3,  1,  3,  4,  5,-10,  6,  1,
		3,  1,  3,  2,  5, -5,  6,  2,
		3,  5,  3, -8,  4,  3,  5,  2,
		1,  1, 12,  3,
		3,  3,  3, -8,  4,  3,  5,  2,
		3,  1,  3, -2,  5,  5,  6,  2,
		3,  3,  2, -6,  3,  4,  4,  0,
		2,  8,  2,-12,  3,  1,
		3,  1,  3,  1,  5, -2,  6,  0,
		2,  9,  3,-15,  4,  2,
		2,  1,  3,  1,  6,  1,
		2,  1, 10, -1, 11,  0,
		1,  2,  4,  1,
		2,  1,  3,  1,  5,  1,
		2,  8,  3,-13,  4,  1,
		2,  3,  2, -6,  3,  0,
		2,  1,  3, -4,  4,  1,
		2,  5,  2, -7,  3,  1,
		2,  7,  3,-11,  4,  1,
		2,  1,  1, -3,  3,  0,
		2,  1,  3,  2,  5,  0,
		2,  2,  3, -6,  4,  0,
		2,  6,  3, -9,  4,  1,
		2,  2,  2, -2,  3,  1,
		2,  5,  3, -7,  4,  2,
		2,  4,  3, -5,  4,  2,
		2,  1,  2, -3,  3,  0,
		2,  7,  2,-10,  3,  0,
		2,  3,  3, -3,  4,  0,
		2,  2,  3, -1,  4,  0,
		2,  4,  2, -5,  3,  1,
		2,  1,  3,  1,  4,  0,
		2,  2,  3, -5,  5,  0,
		2,  8,  3,-12,  4,  0,
		1,  1,  2,  1,
		3,  2,  3, -5,  5,  2,  6,  0,
		2,  2,  3, -4,  5,  1,
		3,  2,  3, -6,  5,  5,  6,  0,
		2,  7,  3,-10,  4,  0,
		3,  2,  3, -4,  5,  2,  6,  0,
		3,  2,  3, -1,  5, -5,  6,  1,
		2,  6,  3, -8,  4,  1,
		2,  2,  3, -3,  5,  1,
		3,  2,  3, -5,  5,  5,  6,  1,
		2,  2,  2, -5,  3,  0,
		2,  6,  2, -8,  3,  0,
		3,  2,  3, -4,  5,  3,  6,  0,
		3,  2,  3, -3,  5,  1,  6,  0,
		2,  5,  3, -6,  4,  1,
		3,  2,  3, -3,  5,  2,  6,  0,
		2,  2,  3, -5,  6,  1,
		2,  2,  3, -2,  5,  1,
		3,  2,  3, -4,  5,  5,  6,  1,
		2,  2,  3, -4,  6,  0,
		2,  4,  3, -4,  4,  0,
		2,  3,  2, -3,  3,  1,
		2,  2,  3, -3,  6,  1,
		3,  2,  3, -2,  5,  2,  6,  0,
		2,  2,  3, -1,  5,  1,
		2,  2,  3, -2,  6,  0,
		2,  3,  3, -2,  4,  1,
		2,  2,  3, -1,  6,  0,
		2,  2,  3, -2,  7,  0,
		3,  2,  3,  2,  5, -5,  6,  0,
		3,  6,  3, -8,  4,  3,  5,  1,
		1,  2, 12,  3,
		3,  2,  3, -8,  4,  3,  5,  1,
		3,  2,  3, -2,  5,  5,  6,  0,
		2,  8,  2,-11,  3,  0,
		2,  2,  3,  1,  5,  0,
		2,  5,  2, -6,  3,  1,
		2,  8,  3,-11,  4,  0,
		2,  1,  1, -2,  3,  0,
		2,  7,  3, -9,  4,  0,
		2,  2,  2, -1,  3,  1,
		2,  6,  3, -7,  4,  0,
		2,  5,  3, -5,  4,  0,
		2,  7,  2, -9,  3,  0,
		2,  4,  3, -3,  4,  0,
		2,  4,  2, -4,  3,  0,
		2,  3,  3, -5,  5,  0,
		2,  1,  2,  1,  3,  0,
		2,  3,  3, -4,  5,  1,
		2,  8,  3,-10,  4,  0,
		2,  7,  3, -8,  4,  0,
		2,  3,  3, -3,  5,  0,
		2,  6,  2, -7,  3,  0,
		2,  6,  3, -6,  4,  0,
		2,  3,  3, -2,  5,  1,
		2,  3,  3, -4,  6,  0,
		2,  5,  3, -4,  4,  0,
		2,  3,  2, -2,  3,  0,
		2,  3,  3, -3,  6,  0,
		2,  3,  3, -1,  5,  0,
		2,  3,  3, -2,  6,  0,
		1,  3, 12,  3,
		2,  5,  2, -5,  3,  0,
		2,  1,  1, -1,  3,  0,
		1,  2,  2,  0,
		2,  7,  2, -8,  3,  0,
		2,  4,  2, -3,  3,  0,
		2,  4,  3, -5,  5,  0,
		2,  4,  3, -4,  5,  0,
		2,  4,  3, -3,  5,  0,
		2,  6,  2, -6,  3,  0,
		2,  4,  3, -2,  5,  0,
		1,  4, 12,  1,
		2,  8,  2, -9,  3,  0,
		2,  5,  2, -4,  3,  0,
		1,  1,  1,  0,
		2,  7,  2, -7,  3,  1,
		2,  5,  3, -5,  5,  0,
		2,  9,  2,-10,  3,  0,
		2,  6,  2, -5,  3,  0,
		2,  8,  2, -8,  3,  0,
		2, 10,  2,-11,  3,  0,
		2,  9,  2, -9,  3,  0,
		2, 10,  2,-10,  3,  0,
		2, 11,  2,-11,  3,  0,
		2,  2,  1, -1,  3,  0,
		-1
	]
};
// moonlr.js
$ns.moonlr = {
	maxargs: 14,
	max_harmonic: [3, 26, 29, 23, 5, 10, 0, 0, 0, 8, 4, 4, 6, 2, 0, 0, 0, 0],
	max_power_of_t: 3,
	distance: 2.5735686895300000e-03,
	timescale: 3.6525000000000000e+06,
	trunclvl: 1.0000000000000000e-04,
	lon_tbl: [	175667, 66453, 5249, -42,
		20057, 403, -2360, 6148,
		-7644, 24646, -1273, 9127,
		-1395, 1958,
		232, -289,
		-97, 553, 69, 130,
		-80, 6,
		129, -868, 26, -89,
		1042, 1172, 194, -112,
		-47433, -241666, 224626, -103752,
		63419, 127606,
		2294, -691, -1827, -1254,
		-1, -119,
		1057, 324,
		505, -195, 254, -641,
		-36, 1008, -1082, -3,
		-87, 122,
		161, 11,
		2, -106,
		29, -123,
		-32, 41,
		-524, -35,
		133, -595,
		225, 837, -108, -191,
		-2294, 841, -340, -394,
		-351, -1039, 238, -108,
		-66, 21,
		1405, 869, 520, 2776,
		-174, 71,
		425, 652, -1260, -80,
		249, 77,
		-192, -17,
		-97, 134,
		-7, -54,
		-802, -7436, -2824, 70869,
		-35, 2481,
		1865, 1749, -2166, 2415,
		33, -183,
		-835, 283,
		27, -45,
		56, 235,
		2, 718,
		-1206, 275, -87, -158,
		-7, -2534, 0, 10774,
		1, -324,
		-208, 821,
		281, 1340, -797, 440,
		224, 72,
		-65, -5,
		-7, -44,
		-48, 66,
		-151, -40,
		-41, -45,
		76, -108,
		-18, 1202, 0, -2501,
		1438, -595, 900, 3040,
		-3435, -5,
		-100, -26,
		0, -13714,
		-183, 68,
		453, -83,
		-228, 325,
		97, 13,
		2, 105,
		-61, 257,
		0, 57,
		88, -11,
		-1, -8220,
		0, 275,
		-43, -10,
		-199, 105,
		1, -5849, 2, 24887,
		-128, 48,
		712, 970, -1407, 845,
		-266, 378,
		311, 1526, -1751, 27,
		0, -185858,
		133, 6383,
		-108, 25,
		-7, 1944,
		5, 390,
		-11, 31,
		277, -384, 158, 72,
		-81, -41, -13, -111,
		-2332, -65804, -698, 505812,
		34, 1676716, -72, -6664384,
		154, -57, 52, 95,
		-4, -5,
		-7, 37,
		-63, -32,
		4, 3349, 1, -14370,
		16, -83,
		0, -401,
		13, 3013,
		48, -20,
		0, 250,
		51, -79,
		-7, -146,
		148, 9,
		0, -64,
		-17, -59,
		-67, -492,
		-2, 2116601,
		-12, -1848,
		8, -436,
		-6, 324, 0, -1363,
		-163, 9,
		0, -74,
		63, 8167, -29, 37587,
		-22, -74501,
		-71, 497,
		-1, 551747,
		-87, -22,
		0, -51,
		-1, -463,
		0, -444,
		3, 89,
		15, -84,
		-36, -6829, -5, -21663,
		0, 86058,
		0, -298,
		-2, 751, -2, -1015,
		0, 69,
		1, -4989, 0, 21458,
		0, -330,
		0, -7,
		0, -226,
		0, -1407, 0, 2942,
		0, 66,
		0, 667,
		0, -155,
		0, 105,
		0, -107,
		0, -74,
		0, -52,
		0, 91,
		0, 59,
		0, 235,
		-1, -1819, 0, 2470,
		71, 13,
		0, 1026,
		14, -54,
		0, -174,
		-121, -19,
		0, -200,
		0, 3008,
		-16, -8043, -10, -37136,
		-3, 73724,
		-157, -5,
		0, -854,
		8, 147,
		-13, -893,
		0, 11869,
		-23, -172,
		89, 14,
		-1, 872, 0, -3744,
		11, 1606,
		0, -559,
		-1, -2530,
		0, 454,
		0, -193,
		-60, -10,
		-82, -13,
		-75, 6,
		36, 81,
		354, -162836, 148, -516569,
		4, 2054441,
		4, -94,
		39, 38,
		61, -30,
		2, 121,
		-11, 590,
		62, 2108,
		0, -12242,
		-476, -42,
		-84, 113,
		-394, 236,
		0, 276,
		-49, 31,
		0, 86,
		1, -1313,
		1, 69,
		-60, 88,
		-46, 18,
		0, -63818,
		14, -93,
		113, 547, -618, 17,
		-7, 12290, -1, -25679,
		0, 92,
		-115, 50,
		-48, 233,
		4, 1311, 1, -5567,
		3, 1251,
		29, 548,
		-244, 257,
		-2, 1825,
		42, 637,
		-46, 68,
		-62, 8,
		3, 110,
		445, -100, -316, -202,
		2925, -621, 763, 1495,
		-169, -184, 20, -76,
		-475, -138, 8, -141,
		-197, 1351, -1284, 422,
		-129, 1879, -102, 8382,
		-9, 45864958,
		-215, 1350, -1285, 422,
		-481, -136, 8, -140,
		40, -53,
		2622, -543, 700, 1406,
		402, -95, -318, -194,
		122, 13,
		-30, 147,
		-121, -902,
		61, -23,
		-63, 7,
		69, 479,
		-224, 228,
		-7, 500,
		0, -429,
		-42, 193,
		-92, 37,
		67, 5,
		-350, -31,
		0, 67,
		-55, -5,
		0, 47,
		-36, 53,
		5, 561,
		0, -126,
		0, 871,
		-52, 4,
		-201, 116922, -22, 371352,
		-12, -1473285,
		0, 87,
		-164, 84,
		-3, 422,
		30, 1434,
		-26, 38,
		2, -1249943,
		-404, -34,
		-57, 79,
		5, 509,
		1, 131,
		-344, 168,
		112, 22540, 30, 71218,
		18, -283983,
		0, -851,
		0, -1538,
		0, 1360,
		-12, 51,
		-48, 68,
		88, -20,
		1, 63,
		0, -568,
		303, 25,
		0, -122,
		87, 586, -606, -14,
		0, -100,
		-85, 8,
		-165, 54,
		-45, 140,
		0, -54,
		4, -831, 1, 3495,
		31, 116,
		-46, -11,
		-371, 190,
		-507, 399,
		-2, 57,
		-60, 36,
		-198, -1174, -613, 4988,
		-87, -4,
		141, 560, -276, 187,
		1876, 1379, 778, 4386,
		24, -15,
		167, -774,
		-71, -9,
		-62, 90,
		98, 580, -663, -7,
		34, -112,
		57, 15,
		-355, -214,
		-3240, -13605, 12229, -5723,
		3496, 7063,
		33, -51,
		1908, 1160, -226, 715,
		964, 1170, -1264, 623,
		14071, 5280, 5614, 3026,
		488, 1576, -2, 226395859,
		824, 1106, -1287, 617,
		1917, 1156, -214, 718,
		90, -97,
		12078, -2366, 3282, 6668,
		-219, 9179, 593, 2015,
		-282, -186,
		57, 25,
		31, -102,
		-77, -4,
		-268, -341, -7, -45,
		-3, 74,
		15, -615,
		-88, -7,
		234, -353,
		1, -119,
		-163, -1159, -601, 4969,
		22, -58,
		-17, -11434,
		17, 54,
		348, 348, -460, 434,
		-371, 175,
		-11, -204,
		4, -6440,
		-5, -53,
		-4, -14388, -37, -45231,
		-7, 179562,
		-44, 136,
		-160, 49,
		-101, 81,
		-1, -188,
		0, 2,
		-4, 12124, -11, -25217,
		71, 543, -557, -14,
		-75, 526,
		0, 395274,
		-233, -16,
		93, -20,
		-43, 61,
		0, -1275,
		0, -824,
		1, -415, 0, 1762,
		-261, 131,
		-45, 64,
		-297, -25,
		0, -17533,
		-6, -56,
		21, 1100,
		1, 327,
		1, 66,
		23, -217,
		-83, -7,
		83, 86847, 49, 275754,
		-4, -1093857,
		-46, 2,
		0, -24,
		0, -419,
		0, -5833,
		1, 506,
		0, -827,
		-1, -377,
		-11, -78,
		0, 131945,
		-2, -334,
		1, -75,
		0, -72,
		0, -213,
		-6, 5564, -2, -11618,
		0, 1790,
		0, -131,
		0, 6,
		0, -76,
		0, -130,
		0, -1115, 0, 4783,
		0, -195,
		0, -627,
		0, -55,
		0, -83,
		0, 163,
		0, -54,
		0, 82,
		0, 149,
		0, -754, 0, 1578,
		0, 138,
		0, 68,
		2, -2506, 0, 3399,
		0, -125,
		86, 16,
		0, -6350, 0, 27316,
		18, -63,
		0, -169,
		-1, 46,
		-136, -21,
		0, -239,
		-30, -8788, -15, -40549,
		-4, 80514,
		-46, -8,
		-168, -6,
		-1, 536, 0, -2314,
		9, 148,
		-13, -842,
		-1, 307713,
		-23, -175,
		95, 15,
		0, -297,
		11, 1341,
		0, -106,
		0, 5,
		-4, 68,
		-114, 10,
		32, 75,
		159, -130487, 98, -413967,
		2, 1647339,
		-4, -85,
		100, -46,
		2, 95,
		-11, 461,
		51, 1647,
		0, -32090,
		-375, -33,
		-65, 86,
		-300, 180,
		0, 836, 0, -3576,
		0, -222,
		0, -993,
		-41, 60,
		0, -4537,
		-431, -34,
		2, 927, 0, -1931,
		-79, 33,
		-31, 144,
		-1, 284, 0, -1207,
		0, 88,
		-11, 315,
		-178, 177,
		-1, 144,
		-58, 986,
		11, 86,
		-228, -110,
		2636, -494, 718, 1474,
		28, -35,
		-24, 782, -797, 277,
		2142, -1231, 856, 1853,
		74, 10797, 0, 23699298,
		-21, 786, -796, 277,
		27, -34,
		2615, -494, 712, 1461,
		-226, -109,
		-11, 663,
		0, -123,
		-169, 157,
		-54, 266,
		0, -76,
		1, -634, 0, 2738,
		-25, 106,
		-63, 24,
		0, -372,
		-221, -24,
		0, -5356,
		0, -219,
		0, 91,
		-28, 7684, -6, 24391,
		-1, -96795,
		-77, 43,
		2, 95,
		-47, -3,
		0, -84530,
		2, 310,
		1, 88,
		111, 19331, 32, 61306,
		4, -243595,
		0, 770,
		0, -103,
		0, 160,
		0, 356,
		0, 236,
		-41, 354,
		39, 303,
		12, -56,
		873, -143, 238, 482,
		-28, 35,
		-93, 31,
		-3, 7690211,
		-91, 33,
		-34, 43,
		824, -130, 226, 450,
		-39, 341,
		-1, -687,
		0, -303,
		11, -2935, 1, 12618,
		121, 924, 9, -1836,
		-268, -1144, -678, 3685,
		-69, -261,
		0, -4115951,
		-69, -261,
		5, -151,
		0, -88,
		0, 91,
		0, 187,
		0, -1281,
		1, 77,
		1, 6059, 3, 19238,
		0, -76305,
		0, -90,
		0, -238,
		0, -962, 0, 4133,
		0, 96,
		0, 9483,
		0, 85,
		0, -688,
		0, -5607,
		0, 55,
		0, -752,
		0, 71,
		0, 303,
		0, -288,
		0, 57,
		0, 45,
		0, 189,
		0, 401,
		0, -1474, 0, 3087,
		0, -71,
		0, 2925,
		0, -75,
		0, 359,
		0, 55,
		1, -10155, 0, 43735,
		0, -572,
		0, -49,
		0, -660,
		0, -3591, 0, 7516,
		0, 668,
		-1, -53,
		-2, 384259,
		0, -163,
		0, -93,
		1, 112,
		-95, -11528, -22, -36505,
		-1, 145308,
		5, 145,
		0, 4047,
		1, 1483, 0, -6352,
		0, 991, 0, -4262,
		0, -93,
		0, -334,
		0, -160,
		0, -153,
		-10, 127,
		51, 185,
		-77, 18,
		56, 1217, 6, 1919574,
		-74, 17,
		50, 180,
		-5, 93,
		0, -104,
		0, -58,
		-3, -353, -1, 1499,
		0, -229,
		-15, 86,
		0, -93657,
		0, 1561, 0, -6693,
		0, -5839,
		1, 6791, 0, -29143,
		1, -701, 0, 3015,
		0, 2543,
		0, 693,
		-1, 361233,
		0, -50,
		0, 946,
		-1, -140,
		-70, 407,
		0, -450995,
		0, -368,
		0, 54,
		0, -802,
		0, -96,
		0, 1274, 0, -5459,
		0, -614, 0, 2633,
		0, 685,
		0, -915,
		0, -85,
		0, 88,
		0, 106,
		0, 928,
		0, -726, 0, 1523,
		0, 5715,
		0, -4338, 0, 18706,
		0, -135,
		0, -132,
		0, -158,
		0, -98,
		0, 680,
		-1, 138968,
		0, -192,
		0, -1698,
		0, -2734, 0, 11769,
		0, 4,
		0, 673, 0, -2891,
		0, 889, 0, -3821,
		0, 121,
		-1, 143783,
		0, 231,
		-9, 51,
		0, -57413,
		0, -483,
		0, -407,
		0, 676, 0, -2902,
		0, 531,
		0, 445,
		0, 672,
		0, 19336,
		0, 70,
		0, -39976,
		0, -68,
		0, 4203,
		0, -406,
		0, 446,
		0, -108,
		0, 79,
		0, 84,
		0, 734,
		0, 255,
		0, 3944,
		0, -655, 0, 2825,
		0, -109,
		0, -234,
		0, 57,
		0, 19773,
		0, -2013,
		0, 958,
		0, -521,
		0, -757,
		0, 10594,
		0, -9901,
		0, 199,
		0, -275,
		0, 64,
		0, 54,
		0, 165,
		0, 1110,
		0, -3286,
		0, 909,
		0, 54,
		0, 87,
		0, 258,
		0, 1261,
		0, -51,
		0, 336,
		0, -114,
		0, 2185,
		0, -850,
		0, 75,
		0, -69,
		0, -103,
		0, 776,
		0, -1238,
		0, 137,
		0, 67,
		0, -260,
		0, 130,
		0, 49,
		0, 228,
		0, 215,
		0, -178,
		0, 57,
		0, -133
	],
	lat_tbl: [],
	rad_tbl: [
		-5422, -2120, 1077, 772,
		39, 75, 3, 10,
		-468, -326, -113, -78,
		-4, -2,
		1, 3,
		29, 24, 4, 2,
		1, 0,
		-9, 7, -2, 0,
		-32, -13, -3, -3,
		233, 126, 89, 77,
		-33, 16,
		3, -3, 0, -1,
		2, 0,
		0, 1,
		4, 9, 1, 1,
		16, -1, 0, 18,
		3, 2,
		0, 0,
		0, 0,
		0, 0,
		0, 0,
		0, -1,
		-22, -5,
		10, 3, 1, 1,
		-15, 7, -2, 1,
		-8, -11, -1, -2,
		-1, 1,
		46, -58, 126, -23,
		4, 8,
		35, 8, 10, -17,
		0, 0,
		0, 0,
		-10, -7,
		0, 0,
		-23, 3, 151, 10,
		-327, 0,
		4, -5, 6, 5,
		1, 0,
		-1, -3,
		0, 0,
		0, 1,
		-185, 0,
		-3, -24, -5, -2,
		-1062, 3, 4560, 0,
		-3, 0,
		4, 1,
		8, -1, 2, 4,
		0, 1,
		0, -1,
		0, 0,
		-1, 0,
		0, 1,
		0, 0,
		-1, -1,
		277, 3, -583, 1,
		-1, 4, -32, 7,
		0, -34,
		1, -1,
		-23685, 0,
		-1, -2,
		-1, -7,
		-5, -4,
		0, 2,
		-2, 0,
		-5, -1,
		35, 0,
		0, 2,
		202, 0,
		180, 0,
		0, -1,
		-3, -6,
		-193, 0, 770, -1,
		-2, -4,
		-32, 23, -28, -46,
		-13, -9,
		-54, 10, -1, -61,
		-44895, 0,
		-230, 5,
		-1, -4,
		-71, 0,
		-15, 0,
		1, 0,
		15, 11, -3, 6,
		2, -3, 4, -1,
		2576, -138, -19881, -47,
		-65906, -1, 261925, -4,
		-2, -7, 4, -2,
		0, 0,
		-1, 0,
		1, -3,
		172, -2, -727, 0,
		4, 1,
		324, 0,
		-139, 1,
		1, 3,
		-276, 0,
		5, 3,
		9, 0,
		-1, 10,
		-37, 0,
		5, -1,
		76, -10,
		1318810, 1,
		12, -1,
		-38, 1,
		-141, 0, 611, 0,
		0, -11,
		4, 0,
		-627, 2, -2882, -3,
		5711, -2,
		-48, -7,
		55294, 0,
		2, -7,
		31, 0,
		34, 0,
		-259, 0,
		-55, 2,
		6, 3,
		-4273, 20, -13554, 3,
		53878, 0,
		-46, 0,
		-85, 0, 114, 0,
		-45, 0,
		-818, 0, 3520, 0,
		34, 0,
		-157, 0,
		29, 0,
		-878, 0, 1838, 0,
		-428, 0,
		161, 0,
		24, 0,
		65, 0,
		19, 0,
		15, 0,
		12, 0,
		-26, 0,
		-14, 0,
		-149, 0,
		584, 0, -793, 0,
		4, -23,
		-238, 0,
		-18, -5,
		45, 0,
		-7, 42,
		79, 0,
		-1723, 0,
		2895, -6, 13362, -4,
		-26525, -1,
		-2, 57,
		291, 0,
		52, -3,
		-327, 5,
		-2755, 0,
		-63, 9,
		5, -33,
		-261, -1, 1122, 0,
		621, -4,
		-227, 0,
		1077, 0,
		-167, 0,
		85, 0,
		-4, 23,
		-5, 32,
		3, 30,
		-32, 14,
		64607, 141, 204958, 59,
		-815115, 2,
		-37, -1,
		15, -15,
		12, 24,
		48, -1,
		235, 4,
		843, -25,
		4621, 0,
		-17, 191,
		45, 34,
		95, 159,
		-132, 0,
		13, 20,
		32, 0,
		-540, 0,
		29, 0,
		37, 25,
		8, 19,
		22127, 0,
		-35, -5,
		232, -48, 7, 262,
		5428, 3, -11342, 1,
		-45, 0,
		-21, -49,
		-100, -21,
		-626, 1, 2665, 0,
		532, -2,
		235, -12,
		-111, -105,
		774, 1,
		-283, 17,
		29, 20,
		3, 27,
		47, -2,
		-43, -192, -87, 136,
		-269, -1264, 646, -330,
		-79, 73, -33, -9,
		60, -205, 61, 4,
		-584, -85, -182, -555,
		-780, -57, -3488, -45,
		-19818328, -4,
		583, 93, 182, 555,
		-59, 208, -60, -4,
		23, 17,
		235, 1133, -608, 302,
		41, 174, 84, -137,
		6, -53,
		63, 13,
		-392, 52,
		-10, -27,
		-3, -27,
		199, -31,
		99, 97,
		-218, -3,
		209, 0,
		84, 18,
		16, 40,
		2, -30,
		14, -154,
		30, 0,
		-2, 24,
		-108, 0,
		-24, -16,
		262, -2,
		55, 0,
		-304, 0,
		2, 25,
		55112, 95, 175036, 11,
		-694477, 5,
		41, 0,
		-38, -76,
		199, 1,
		679, -14,
		-17, -12,
		582619, 1,
		-16, 191,
		38, 27,
		-234, 2,
		-60, 0,
		80, 163,
		-10296, 48, -32526, 13,
		129703, 8,
		-1366, 0,
		-741, 0,
		-646, 0,
		25, 6,
		33, 23,
		10, 43,
		-31, 0,
		-6, 0,
		-12, 147,
		59, 0,
		287, -42, -7, 297,
		-59, 0,
		-4, -42,
		-27, -81,
		-69, -22,
		27, 0,
		-423, -2, 1779, -1,
		-57, 15,
		5, -23,
		94, 182,
		-197, -250,
		24, 1,
		-18, -30,
		581, -98, -2473, -303,
		-2, 43,
		-277, 70, -92, -136,
		-681, 925, -2165, 384,
		-8, -12,
		382, 82,
		-4, 35,
		-45, -31,
		-286, 48, 3, -328,
		-55, -17,
		8, -28,
		-106, 175,
		-6735, 1601, -2832, -6052,
		3495, -1730,
		-25, -17,
		-574, 944, -354, -112,
		-579, 476, -308, -625,
		-2411, 7074, -1529, 2828,
		-1335, 247, -112000844, -1,
		545, -409, 305, 637,
		572, -950, 356, 106,
		48, 44,
		1170, 5974, -3298, 1624,
		-4538, -106, -996, 294,
		92, -139,
		-12, 28,
		50, 16,
		2, -38,
		169, -133, 22, -3,
		38, 1,
		305, 7,
		4, -44,
		175, 116,
		59, 1,
		-573, 81, 2453, 297,
		29, 11,
		5674, -8,
		-27, 9,
		173, -173, 215, 228,
		-87, -184,
		102, -5,
		3206, 2,
		-53, 2,
		7159, -7, 22505, -19,
		-89344, -3,
		67, 22,
		24, 79,
		-40, -50,
		94, 0,
		186, 0,
		-6063, 0, 12612, -5,
		-271, 35, 7, -278,
		-479, -74,
		426754, 0,
		8, -116,
		-10, -47,
		-31, -22,
		645, 0,
		426, 0,
		-213, 0, 903, 0,
		-67, -133,
		-33, -23,
		13, -152,
		-9316, 0,
		29, -3,
		-564, 11,
		-167, 0,
		-34, 0,
		114, 12,
		4, -44,
		-44561, 42, -141493, 25,
		561256, -2,
		-1, -24,
		-261, 0,
		211, 0,
		-4263, 0,
		-262, 1,
		1842, 0,
		202, 0,
		41, -6,
		77165, 0,
		176, -1,
		39, 1,
		-24, 0,
		118, 0,
		-2991, -4, 6245, -1,
		46886, 0,
		-75, 0,
		-100, 0,
		40, 0,
		75, 0,
		-618, 0, 2652, 0,
		112, 0,
		1780, 0,
		30, 0,
		49, 0,
		86, 0,
		33, 0,
		-30, 0,
		-95, 0,
		277, 0, -580, 0,
		-35, 0,
		-319, 0,
		1622, 1, -2201, 0,
		79, 0,
		10, -57,
		2363, 0, -10162, 0,
		-41, -12,
		62, 0,
		30, 1,
		-14, 89,
		-2721, 0,
		5780, -19, 26674, -10,
		-52964, -2,
		-5, 30,
		-4, 111,
		-317, -1, 1369, 0,
		93, -6,
		-564, 9,
		-115913, 0,
		-113, 15,
		10, -62,
		99, 0,
		891, -7,
		36, 0,
		108, 0,
		-42, -2,
		7, 75,
		-50, 21,
		86822, 104, 275441, 65,
		-1096109, 1,
		-56, 3,
		31, 66,
		63, -1,
		307, 7,
		1097, -34,
		17453, 0,
		-22, 250,
		57, 43,
		120, 200,
		-297, 0, 1269, 0,
		166, 0,
		-662, 0,
		40, 28,
		1521, 0,
		-23, 288,
		351, -2, -729, 0,
		-22, -52,
		-96, -21,
		-139, -1, 589, 0,
		35, 0,
		210, 7,
		-118, -119,
		62, 0,
		-583, -26,
		-42, 5,
		-73, 152,
		-330, -1759, 983, -479,
		-23, -19,
		-522, -15, -185, -533,
		739, 1559, -1300, 614,
		-7332, 52, -15836758, 0,
		524, 16, 185, 532,
		23, 18,
		330, 1751, -978, 476,
		73, -151,
		519, 18,
		38, 0,
		105, 113,
		-178, -37,
		26, 0,
		262, 1, -1139, 0,
		71, 17,
		16, 42,
		151, 0,
		16, -148,
		4147, 0,
		149, 0,
		-30, 0,
		2980, 9, 9454, 2,
		-37519, 0,
		-28, -49,
		37, -1,
		2, -31,
		33870, 0,
		-208, 1,
		-59, 1,
		-13105, 68, -41564, 21,
		165148, 3,
		-1022, 0,
		-40, 0,
		-132, 0,
		-228, 0,
		95, 0,
		-138, -16,
		-126, 16,
		24, 5,
		-57, -346, 191, -94,
		-14, -11,
		-12, -37,
		-3053364, -1,
		13, 36,
		17, 13,
		51, 327, -179, 90,
		138, 16,
		233, 0,
		62, 0,
		1164, 0, -5000, 0,
		-407, 117, 770, 9,
		-4, 1, 21, 2,
		1, 0,
		-16869, 0,
		-1, 0,
		1, 0,
		35, 0,
		-78, 0,
		78, 0,
		-533, 0,
		-31, 1,
		-2448, -6, -7768, -1,
		30812, 0,
		37, 0,
		-227, 0,
		197, 0, -846, 0,
		-77, 0,
		4171, 0,
		-67, 0,
		287, 0,
		2532, 0,
		-19, 0,
		-40, 0,
		-56, 0,
		128, 0,
		83, 0,
		-45, 0,
		-36, 0,
		-92, 0,
		-134, 0,
		714, 0, -1495, 0,
		32, 0,
		-981, 0,
		15, 0,
		-166, 0,
		-59, 0,
		4923, 0, -21203, 0,
		246, 0,
		15, 0,
		104, 0,
		1683, 0, -3523, 0,
		-865, 0,
		-25, 1,
		-186329, -1,
		10, 0,
		50, 0,
		53, 0,
		5455, -45, 17271, -10,
		-68747, 0,
		69, -2,
		-7604, 0,
		-724, 1, 3101, 0,
		-46, 0, 200, 0,
		-44, 0,
		97, 0,
		-53, 0,
		62, 0,
		-54, -4,
		88, -24,
		-9, -36,
		-581, 27, -914711, 3,
		8, 35,
		-86, 24,
		51, 3,
		48, 0,
		26, 0,
		133, 1, -577, 0,
		105, 0,
		-3, -1,
		3194, 0,
		528, 0, -2263, 0,
		2028, 0,
		-3266, 1, 14016, 0,
		10, 0, -41, 0,
		-100, 0,
		-32, 0,
		-124348, 0,
		16, 0,
		-325, 0,
		50, -1,
		1, 0,
		-553, 0,
		0, 0,
		0, 0,
		2, 0,
		-34, 0,
		-444, 0, 1902, 0,
		9, 0, -37, 0,
		254, 0,
		156, 0,
		-2, 0,
		-35, 0,
		-48, 0,
		-368, 0,
		327, 0, -686, 0,
		-2263, 0,
		1952, 0, -8418, 0,
		-13, 0,
		52, 0,
		9, 0,
		21, 0,
		-261, 0,
		-62404, 0,
		0, 0,
		79, 0,
		1056, 0, -4547, 0,
		-351, 0,
		-305, 0, 1310, 0,
		-1, 0, 6, 0,
		0, 0,
		-55953, 0,
		-80, 0,
		0, 0,
		168, 0,
		-147, 0,
		127, 0,
		-265, 0, 1138, 0,
		-1, 0,
		-9, 0,
		-8, 0,
		-5984, 0,
		-22, 0,
		-5, 0,
		0, 0,
		0, 0,
		127, 0,
		-2, 0,
		10, 0,
		-31, 0,
		-29, 0,
		-286, 0,
		-98, 0,
		-1535, 0,
		252, 0, -1087, 0,
		43, 0,
		4, 0,
		-19, 0,
		-7620, 0,
		29, 0,
		-322, 0,
		203, 0,
		0, 0,
		-3587, 0,
		10, 0,
		0, 0,
		94, 0,
		0, 0,
		-1, 0,
		-1, 0,
		-315, 0,
		1, 0,
		0, 0,
		0, 0,
		-30, 0,
		-94, 0,
		-460, 0,
		1, 0,
		-114, 0,
		0, 0,
		-746, 0,
		4, 0,
		-23, 0,
		24, 0,
		0, 0,
		-237, 0,
		1, 0,
		0, 0,
		-18, 0,
		0, 0,
		0, 0,
		-16, 0,
		-76, 0,
		-67, 0,
		0, 0,
		-16, 0,
		0, 0
	],
	arg_tbl: [
		0, 3,
		3, 4, 3, -8, 4, 3, 5, 1,
		2, 2, 5, -5, 6, 2,
		5, -1, 10, 2, 13, -1, 11, 3, 3, -7, 4, 0,
		3, 1, 13, -1, 11, 2, 5, 1,
		2, 4, 5, -10, 6, 0,
		4, 2, 10, -2, 13, 14, 3, -23, 4, 1,
		3, 3, 2, -7, 3, 4, 4, 1,
		3, -1, 13, 18, 2, -16, 3, 2,
		2, 8, 2, -13, 3, 1,
		5, 2, 10, -2, 13, 2, 3, -3, 5, 1, 6, 0,
		3, -1, 13, 26, 2, -29, 3, 0,
		3, 1, 10, -1, 11, 2, 4, 1,
		4, 1, 10, -1, 13, 3, 2, -4, 3, 1,
		4, 1, 10, -1, 13, 3, 3, -4, 4, 0,
		3, -1, 10, 15, 2, -12, 3, 0,
		4, 2, 10, -3, 13, 24, 2, -24, 3, 0,
		3, -1, 10, 23, 2, -25, 3, 0,
		4, 1, 10, -1, 11, 1, 3, 1, 6, 0,
		4, 2, 10, -2, 11, 5, 2, -6, 3, 0,
		4, 2, 10, -2, 13, 6, 2, -8, 3, 0,
		4, -2, 10, 1, 13, 12, 2, -8, 3, 1,
		5, -1, 10, 1, 13, -1, 11, 20, 2, -20, 3, 1,
		4, -2, 10, 1, 13, 3, 1, -1, 3, 1,
		5, 2, 10, -2, 13, 2, 3, -5, 5, 5, 6, 0,
		4, 2, 10, -2, 13, 2, 3, -3, 5, 1,
		4, 2, 10, -2, 13, 6, 3, -8, 4, 0,
		4, -2, 10, 1, 13, 20, 2, -21, 3, 1,
		4, 1, 10, -1, 11, 1, 3, 1, 5, 0,
		1, 1, 6, 0,
		4, 2, 10, -2, 13, 5, 3, -6, 4, 0,
		3, 3, 2, -5, 3, 2, 5, 0,
		2, -1, 11, 1, 14, 1,
		4, 2, 10, -2, 13, 2, 3, -2, 5, 0,
		2, 1, 3, -2, 4, 1,
		4, 1, 10, -1, 11, 5, 2, -7, 3, 0,
		1, 1, 5, 0,
		2, 7, 3, -13, 4, 0,
		4, -2, 10, 1, 13, 15, 2, -13, 3, 0,
		4, 2, 10, -2, 13, 3, 2, -3, 3, 0,
		2, -2, 11, 2, 14, 1,
		3, 1, 10, 1, 12, -1, 13, 1,
		3, -1, 13, 21, 2, -21, 3, 0,
		2, 3, 2, -5, 3, 0,
		2, 2, 3, -4, 4, 1,
		2, 5, 2, -8, 3, 0,
		3, -1, 13, 23, 2, -24, 3, 0,
		2, 6, 3, -11, 4, 0,
		1, 2, 5, 0,
		2, 3, 3, -6, 4, 0,
		2, 5, 3, -9, 4, 0,
		4, 1, 10, -1, 11, 1, 3, -2, 5, 0,
		3, 2, 10, 2, 12, -2, 13, 1,
		2, 2, 2, -3, 3, 2,
		2, 4, 3, -7, 4, 0,
		2, 2, 13, -2, 11, 0,
		2, 3, 3, -5, 4, 0,
		2, 1, 2, -2, 3, 0,
		2, 2, 3, -3, 4, 0,
		4, 1, 10, -1, 11, 4, 2, -5, 3, 0,
		2, 1, 3, -1, 4, 0,
		2, 4, 2, -6, 3, 0,
		4, 2, 10, -2, 13, 2, 2, -2, 3, 0,
		3, 1, 10, -1, 11, 1, 2, 0,
		2, 1, 2, -1, 3, 0,
		3, 1, 12, 2, 13, -2, 11, 0,
		2, 5, 3, -8, 4, 0,
		2, 1, 3, -3, 5, 0,
		3, 2, 10, 1, 12, -2, 13, 1,
		2, 4, 3, -6, 4, 0,
		2, 1, 3, -2, 5, 1,
		2, 3, 3, -4, 4, 0,
		2, 3, 2, -4, 3, 1,
		2, 1, 10, -1, 13, 0,
		2, 1, 3, -1, 5, 0,
		2, 1, 3, -2, 6, 0,
		2, 2, 3, -2, 4, 0,
		2, 1, 3, -1, 6, 0,
		2, 8, 2, -14, 3, 0,
		3, 1, 3, 2, 5, -5, 6, 1,
		3, 5, 3, -8, 4, 3, 5, 1,
		1, 1, 12, 3,
		3, 3, 3, -8, 4, 3, 5, 1,
		3, 1, 3, -2, 5, 5, 6, 0,
		2, 8, 2, -12, 3, 0,
		2, 1, 3, 1, 5, 0,
		3, 2, 10, 1, 12, -2, 11, 1,
		2, 5, 2, -7, 3, 0,
		3, 1, 10, 1, 13, -2, 11, 0,
		2, 2, 2, -2, 3, 0,
		2, 5, 3, -7, 4, 0,
		3, 1, 12, -2, 13, 2, 11, 0,
		2, 4, 3, -5, 4, 0,
		2, 3, 3, -3, 4, 0,
		1, 1, 2, 0,
		3, 3, 10, 1, 12, -3, 13, 0,
		2, 2, 3, -4, 5, 0,
		2, 2, 3, -3, 5, 0,
		2, 2, 10, -2, 13, 0,
		2, 2, 3, -2, 5, 0,
		2, 3, 2, -3, 3, 0,
		3, 1, 10, -1, 12, -1, 13, 1,
		2, 2, 3, -1, 5, 0,
		2, 2, 3, -2, 6, 0,
		1, 2, 12, 2,
		3, -2, 10, 1, 11, 1, 14, 0,
		2, 2, 10, -2, 11, 0,
		2, 2, 2, -1, 3, 0,
		4, -2, 10, 2, 13, 1, 2, -1, 3, 0,
		2, 4, 2, -4, 3, 0,
		2, 3, 10, -3, 13, 0,
		4, -2, 10, 2, 13, 1, 3, -1, 5, 0,
		2, 3, 3, -3, 5, 0,
		3, 2, 10, -1, 12, -2, 13, 2,
		3, 3, 10, -1, 13, -2, 11, 0,
		1, 3, 12, 1,
		4, -2, 10, 2, 13, 2, 2, -2, 3, 0,
		3, 2, 10, -1, 12, -2, 11, 1,
		2, 5, 2, -5, 3, 0,
		2, 4, 10, -4, 13, 0,
		2, 6, 2, -6, 3, 0,
		3, 2, 10, -2, 12, -2, 13, 1,
		3, 4, 10, -2, 13, -2, 11, 0,
		3, 2, 10, -2, 12, -2, 11, 0,
		2, 7, 2, -7, 3, 0,
		3, 2, 10, -3, 12, -2, 13, 0,
		2, 8, 2, -8, 3, 0,
		2, 9, 2, -9, 3, 0,
		2, 10, 2, -10, 3, 0,
		3, 2, 10, -4, 12, -1, 13, 0,
		3, 4, 10, -2, 12, -3, 13, 0,
		4, 4, 10, -1, 12, -1, 13, -2, 11, 0,
		3, 2, 10, -3, 12, -1, 13, 1,
		4, -2, 10, 1, 13, 3, 3, -2, 5, 0,
		3, 4, 10, -1, 12, -3, 13, 0,
		4, -2, 10, 1, 13, 3, 3, -3, 5, 0,
		4, 2, 10, -2, 12, 1, 13, -2, 11, 0,
		4, -2, 10, 1, 13, 2, 2, -1, 3, 0,
		3, 3, 10, -1, 12, -2, 11, 0,
		3, 4, 10, -1, 13, -2, 11, 0,
		3, 2, 10, -2, 12, -1, 13, 2,
		4, -2, 10, 1, 13, 2, 3, -1, 5, 0,
		3, 3, 10, -1, 12, -2, 13, 0,
		4, -2, 10, 1, 13, 3, 2, -3, 3, 0,
		4, -2, 10, 1, 13, 2, 3, -2, 5, 0,
		2, 4, 10, -3, 13, 0,
		4, -2, 10, 1, 13, 2, 3, -3, 5, 0,
		3, -2, 10, 1, 13, 1, 2, 0,
		4, 2, 10, -1, 12, 1, 13, -2, 11, 1,
		4, -2, 10, 1, 13, 2, 2, -2, 3, 0,
		2, 3, 12, -1, 13, 0,
		2, 3, 10, -2, 11, 0,
		2, 1, 10, -2, 12, 0,
		4, 4, 10, 1, 12, -1, 13, -2, 11, 0,
		3, -1, 13, 3, 2, -2, 3, 0,
		3, -1, 13, 3, 3, -2, 5, 0,
		3, -2, 10, 18, 2, -15, 3, 0,
		5, 2, 10, -1, 13, 3, 3, -8, 4, 3, 5, 0,
		3, 2, 10, -1, 12, -1, 13, 2,
		5, -2, 10, 1, 13, 5, 3, -8, 4, 3, 5, 0,
		5, -2, 10, 1, 13, 1, 3, 2, 5, -5, 6, 0,
		4, 2, 10, -2, 13, 18, 2, -17, 3, 0,
		4, -2, 10, 1, 13, 1, 3, -1, 6, 0,
		4, -2, 10, 1, 13, 2, 3, -2, 4, 0,
		4, -2, 10, 1, 13, 1, 3, -1, 5, 0,
		2, 3, 10, -2, 13, 0,
		4, -2, 10, 1, 13, 3, 2, -4, 3, 0,
		4, -2, 10, 1, 13, 3, 3, -4, 4, 0,
		4, -2, 10, 1, 13, 1, 3, -2, 5, 0,
		3, 4, 10, 1, 12, -3, 13, 0,
		4, -2, 10, 1, 13, 1, 3, -3, 5, 0,
		3, -1, 13, 4, 2, -4, 3, 0,
		4, -2, 10, 1, 13, 1, 2, -1, 3, 0,
		4, -2, 10, 1, 13, 1, 3, -1, 4, 0,
		4, -2, 10, 1, 13, 2, 3, -3, 4, 0,
		4, -2, 10, 1, 13, 3, 3, -5, 4, 0,
		3, 2, 10, 1, 13, -2, 11, 0,
		4, -2, 10, -1, 13, 1, 11, 1, 14, 0,
		4, -2, 10, 1, 13, 2, 2, -3, 3, 1,
		2, 2, 12, -1, 13, 1,
		3, 3, 10, 1, 12, -2, 11, 0,
		4, 2, 10, -1, 13, 2, 3, -4, 4, 0,
		4, 2, 10, -1, 13, 3, 2, -5, 3, 0,
		2, 1, 10, -1, 12, 1,
		3, -1, 13, 3, 2, -3, 3, 0,
		3, -2, 10, 1, 13, 1, 5, 0,
		4, 2, 10, -1, 13, 1, 3, -2, 4, 0,
		3, -1, 13, 2, 3, -2, 5, 0,
		4, 2, 10, -1, 13, -1, 11, 1, 14, 0,
		3, -1, 13, 5, 3, -6, 4, 0,
		3, -2, 10, 1, 13, 1, 6, 0,
		3, -1, 10, 1, 3, -1, 5, 0,
		4, -2, 10, 1, 13, 8, 2, -13, 3, 1,
		3, -2, 10, 18, 2, -16, 3, 1,
		5, -2, 10, 1, 13, 3, 2, -7, 3, 4, 4, 1,
		4, 2, 10, -1, 13, 2, 5, -5, 6, 1,
		5, 2, 10, -1, 13, 4, 3, -8, 4, 3, 5, 1,
		2, 2, 10, -1, 13, 2,
		5, -2, 10, 1, 13, 4, 3, -8, 4, 3, 5, 1,
		4, -2, 10, 1, 13, 2, 5, -5, 6, 1,
		5, 2, 10, -1, 13, 3, 2, -7, 3, 4, 4, 0,
		4, 2, 10, -2, 13, 18, 2, -16, 3, 1,
		4, 2, 10, -1, 13, 8, 2, -13, 3, 1,
		3, -1, 10, 3, 2, -4, 3, 0,
		3, -1, 13, 6, 2, -8, 3, 0,
		3, -1, 13, 2, 3, -3, 5, 0,
		3, -1, 13, 6, 3, -8, 4, 0,
		3, 2, 10, -1, 13, 1, 6, 0,
		4, -2, 10, 1, 13, -1, 11, 1, 14, 0,
		4, -2, 10, 1, 13, 1, 3, -2, 4, 0,
		3, 2, 10, -1, 13, 1, 5, 0,
		3, 3, 10, 1, 12, -2, 13, 0,
		4, -2, 10, 1, 13, 3, 2, -5, 3, 0,
		4, -2, 10, 1, 13, 2, 3, -4, 4, 0,
		2, -1, 13, 1, 2, 0,
		4, 2, 10, -1, 13, 2, 2, -3, 3, 0,
		3, -1, 10, 1, 2, -1, 3, 0,
		3, -1, 13, 4, 2, -5, 3, 0,
		3, 2, 10, -3, 13, 2, 11, 0,
		4, 2, 10, -1, 13, 2, 3, -3, 4, 0,
		3, -1, 13, 2, 2, -2, 3, 0,
		4, 2, 10, -1, 13, 1, 2, -1, 3, 0,
		4, 2, 10, 1, 12, 1, 13, -2, 11, 0,
		3, -2, 13, 18, 2, -15, 3, 0,
		2, 1, 12, -1, 13, 2,
		3, -1, 13, 1, 3, -1, 6, 0,
		4, 2, 10, -1, 13, 1, 3, -2, 5, 0,
		3, -1, 13, 2, 3, -2, 4, 0,
		3, -1, 13, 1, 3, -1, 5, 0,
		4, 2, 10, -1, 13, 3, 3, -4, 4, 0,
		1, 1, 10, 0,
		3, -1, 13, 3, 2, -4, 3, 0,
		3, -1, 13, 3, 3, -4, 4, 0,
		4, 2, 10, -1, 13, 1, 3, -1, 5, 0,
		4, 2, 10, -1, 13, 2, 3, -2, 4, 0,
		3, -1, 13, 1, 3, -2, 5, 0,
		3, 2, 10, 1, 12, -1, 13, 2,
		3, 1, 12, 1, 13, -2, 11, 0,
		3, -1, 13, 1, 2, -1, 3, 0,
		4, 2, 10, -1, 13, 2, 2, -2, 3, 0,
		3, -1, 13, 4, 2, -6, 3, 0,
		3, -1, 13, 2, 3, -3, 4, 0,
		3, 1, 13, 1, 2, -2, 3, 0,
		4, 2, 10, -1, 13, 3, 3, -3, 4, 0,
		2, 3, 13, -2, 11, 0,
		4, 2, 10, -1, 13, 4, 2, -5, 3, 0,
		3, 1, 10, 1, 2, -1, 3, 0,
		3, -1, 13, 2, 2, -3, 3, 1,
		3, 2, 10, 2, 12, -3, 13, 0,
		3, 2, 10, -1, 13, 1, 2, 0,
		3, 1, 13, 2, 3, -4, 4, 0,
		3, 1, 13, 3, 2, -5, 3, 0,
		2, 21, 2, -21, 3, 0,
		3, 1, 10, 1, 12, -2, 13, 1,
		4, 2, 10, -1, 13, 2, 3, -4, 5, 0,
		4, 2, 10, -1, 13, 7, 3, -10, 4, 0,
		2, -1, 13, 1, 5, 0,
		3, 1, 13, 1, 3, -2, 4, 0,
		4, 2, 10, -3, 13, 2, 3, -2, 5, 0,
		3, 1, 10, 1, 3, -2, 5, 0,
		3, 1, 13, -1, 11, 1, 14, 1,
		2, -1, 13, 1, 6, 0,
		4, 2, 10, -1, 13, 6, 3, -8, 4, 1,
		4, 2, 10, -1, 13, 2, 3, -3, 5, 1,
		3, -1, 13, 8, 3, -15, 4, 0,
		4, 2, 10, -1, 13, 6, 2, -8, 3, 0,
		5, 2, 10, -1, 13, -2, 11, 5, 2, -6, 3, 0,
		3, 1, 10, 3, 3, -4, 4, 0,
		3, 1, 10, 3, 2, -4, 3, 1,
		4, 1, 10, -1, 13, -1, 11, 2, 4, 0,
		3, -2, 13, 26, 2, -29, 3, 0,
		3, -1, 13, 8, 2, -13, 3, 0,
		3, -2, 13, 18, 2, -16, 3, 2,
		4, -1, 13, 3, 2, -7, 3, 4, 4, 0,
		3, 1, 13, 2, 5, -5, 6, 1,
		4, 1, 13, 4, 3, -8, 4, 3, 5, 1,
		1, 1, 13, 3,
		4, -1, 13, 4, 3, -8, 4, 3, 5, 1,
		3, -1, 13, 2, 5, -5, 6, 1,
		4, 1, 13, 3, 2, -7, 3, 4, 4, 0,
		2, 18, 2, -16, 3, 1,
		3, 1, 13, 8, 2, -13, 3, 2,
		2, 26, 2, -29, 3, 0,
		4, 1, 10, 1, 13, -1, 11, 2, 4, 0,
		5, 2, 10, 1, 13, -2, 11, 5, 2, -6, 3, 0,
		3, 1, 13, 8, 3, -15, 4, 1,
		4, 2, 10, -3, 13, 2, 3, -3, 5, 0,
		3, 1, 10, 1, 3, -1, 5, 0,
		2, 1, 13, 1, 6, 0,
		4, 2, 10, -1, 13, 5, 3, -6, 4, 0,
		3, 1, 10, 2, 3, -2, 4, 0,
		3, -1, 13, -1, 11, 1, 14, 1,
		4, 2, 10, -1, 13, 2, 3, -5, 6, 0,
		4, 2, 10, -1, 13, 2, 3, -2, 5, 0,
		5, 2, 10, -1, 13, 2, 3, -4, 5, 5, 6, 0,
		3, -1, 13, 1, 3, -2, 4, 1,
		2, 1, 13, 1, 5, 0,
		4, 2, 10, -1, 13, 4, 3, -4, 4, 0,
		4, 2, 10, -1, 13, 3, 2, -3, 3, 0,
		4, 2, 10, 2, 12, -1, 13, -2, 11, 0,
		2, 1, 10, 1, 12, 2,
		3, -1, 13, 3, 2, -5, 3, 0,
		3, -1, 13, 2, 3, -4, 4, 0,
		4, 2, 10, -1, 13, 2, 3, -1, 5, 0,
		4, 2, 10, -1, 13, 2, 3, -2, 6, 0,
		3, 1, 10, 1, 12, -2, 11, 0,
		3, 2, 10, 2, 12, -1, 13, 1,
		3, 1, 13, 2, 2, -3, 3, 1,
		3, -1, 13, 1, 11, 1, 14, 0,
		2, 1, 13, -2, 11, 0,
		4, 2, 10, -1, 13, 5, 2, -6, 3, 0,
		3, -1, 13, 1, 2, -2, 3, 0,
		3, 1, 13, 2, 3, -3, 4, 0,
		3, 1, 13, 1, 2, -1, 3, 0,
		4, 2, 10, -1, 13, 4, 2, -4, 3, 0,
		3, 2, 10, 1, 12, -3, 13, 1,
		3, 1, 13, 1, 3, -2, 5, 0,
		3, 1, 13, 3, 3, -4, 4, 0,
		3, 1, 13, 3, 2, -4, 3, 0,
		2, 1, 10, -2, 13, 0,
		4, 2, 10, -1, 13, 3, 3, -4, 5, 0,
		3, 1, 13, 1, 3, -1, 5, 0,
		3, 1, 13, 2, 3, -2, 4, 0,
		3, 1, 13, 1, 3, -1, 6, 0,
		4, 2, 10, -1, 13, 3, 3, -3, 5, 0,
		4, 2, 10, -1, 13, 6, 2, -7, 3, 0,
		2, 1, 12, 1, 13, 2,
		4, 2, 10, -1, 13, 3, 3, -2, 5, 0,
		4, 2, 10, 1, 12, -1, 13, -2, 11, 0,
		2, 1, 10, 2, 12, 0,
		2, 1, 10, -2, 11, 0,
		3, 1, 13, 2, 2, -2, 3, 0,
		3, 1, 12, -1, 13, 2, 11, 0,
		4, 2, 10, -1, 13, 5, 2, -5, 3, 0,
		3, 1, 13, 2, 3, -3, 5, 0,
		2, 2, 10, -3, 13, 0,
		3, 1, 13, 2, 3, -2, 5, 0,
		3, 1, 13, 3, 2, -3, 3, 0,
		3, 1, 10, -1, 12, -2, 13, 0,
		4, 2, 10, -1, 13, 6, 2, -6, 3, 0,
		2, 2, 12, 1, 13, 1,
		3, 2, 10, -1, 13, -2, 11, 0,
		3, 1, 10, -1, 12, -2, 11, 0,
		3, 2, 10, 1, 13, -4, 11, 0,
		3, 1, 13, 4, 2, -4, 3, 0,
		4, 2, 10, -1, 13, 7, 2, -7, 3, 0,
		3, 2, 10, -1, 12, -3, 13, 1,
		2, 3, 12, 1, 13, 0,
		4, 2, 10, -1, 12, -1, 13, -2, 11, 0,
		3, 1, 13, 5, 2, -5, 3, 0,
		4, 2, 10, -1, 13, 8, 2, -8, 3, 0,
		3, 2, 10, -2, 12, -3, 13, 0,
		4, 2, 10, -1, 13, 9, 2, -9, 3, 0,
		3, 4, 10, -3, 12, -2, 13, 0,
		2, 2, 10, -4, 12, 0,
		3, 4, 10, -2, 12, -2, 13, 1,
		2, 6, 10, -4, 13, 0,
		3, 4, 10, -1, 12, -2, 11, 0,
		2, 2, 10, -3, 12, 1,
		3, 3, 10, -2, 12, -1, 13, 0,
		3, -2, 10, 3, 3, -2, 5, 0,
		3, 4, 10, -1, 12, -2, 13, 1,
		3, -2, 10, 3, 3, -3, 5, 0,
		2, 5, 10, -3, 13, 0,
		3, -2, 10, 4, 2, -4, 3, 0,
		3, -2, 10, 2, 2, -1, 3, 0,
		2, 4, 10, -2, 11, 0,
		2, 2, 10, -2, 12, 2,
		3, -2, 10, 3, 3, -2, 4, 0,
		3, -2, 10, 2, 3, -1, 5, 0,
		3, 3, 10, -1, 12, -1, 13, 1,
		3, -2, 10, 3, 2, -3, 3, 0,
		3, -2, 10, 2, 3, -2, 5, 0,
		2, 4, 10, -2, 13, 0,
		3, -2, 10, 2, 3, -3, 5, 0,
		2, -2, 10, 1, 2, 0,
		4, 2, 10, -1, 12, 2, 13, -2, 11, 0,
		3, -2, 10, 2, 2, -2, 3, 0,
		3, 3, 10, 1, 13, -2, 11, 0,
		3, 4, 10, 1, 12, -2, 11, 0,
		4, 2, 10, -1, 12, -1, 11, 1, 14, 0,
		4, -2, 10, -1, 13, 18, 2, -15, 3, 0,
		4, 2, 10, 3, 3, -8, 4, 3, 5, 0,
		2, 2, 10, -1, 12, 2,
		4, -2, 10, 5, 3, -8, 4, 3, 5, 0,
		4, 2, 10, -1, 13, 18, 2, -17, 3, 0,
		3, -2, 10, 1, 3, -1, 6, 0,
		3, -2, 10, 2, 3, -2, 4, 0,
		3, -2, 10, 1, 3, -1, 5, 0,
		2, 3, 10, -1, 13, 0,
		3, -2, 10, 3, 2, -4, 3, 0,
		3, -2, 10, 3, 3, -4, 4, 0,
		3, -2, 10, 1, 3, -2, 5, 0,
		3, 4, 10, 1, 12, -2, 13, 1,
		4, 2, 10, -1, 12, -2, 13, 2, 11, 0,
		3, -2, 10, 1, 2, -1, 3, 0,
		3, -2, 10, 2, 3, -3, 4, 0,
		3, 2, 10, 2, 13, -2, 11, 0,
		3, -2, 10, 2, 2, -3, 3, 0,
		2, 2, 12, -2, 13, 1,
		3, 2, 10, 2, 3, -4, 4, 0,
		3, 2, 10, 3, 2, -5, 3, 0,
		3, 1, 10, -1, 12, 1, 13, 1,
		3, -2, 13, 3, 2, -3, 3, 0,
		2, -2, 10, 1, 5, 0,
		3, 2, 10, 1, 3, -2, 4, 0,
		3, -2, 13, 2, 3, -2, 5, 0,
		3, 2, 10, -1, 11, 1, 14, 0,
		4, 4, 10, -2, 13, 2, 3, -3, 5, 0,
		3, -2, 10, 8, 2, -13, 3, 0,
		4, -2, 10, -1, 13, 18, 2, -16, 3, 1,
		4, -2, 10, 3, 2, -7, 3, 4, 4, 0,
		4, 2, 10, 4, 3, -8, 4, 3, 5, 1,
		1, 2, 10, 3,
		4, -2, 10, 4, 3, -8, 4, 3, 5, 1,
		4, 2, 10, 3, 2, -7, 3, 4, 4, 0,
		4, 2, 10, -1, 13, 18, 2, -16, 3, 1,
		3, 2, 10, 8, 2, -13, 3, 0,
		3, -2, 10, -1, 11, 1, 14, 0,
		4, 4, 10, -2, 13, 2, 3, -2, 5, 0,
		3, -2, 10, 1, 3, -2, 4, 0,
		2, 2, 10, 1, 5, 0,
		4, 4, 10, -2, 13, 3, 2, -3, 3, 0,
		3, 3, 10, 1, 12, -1, 13, 1,
		3, -2, 10, 3, 2, -5, 3, 0,
		3, -2, 10, 2, 3, -4, 4, 0,
		3, 4, 10, 2, 12, -2, 13, 0,
		3, 2, 10, 2, 2, -3, 3, 0,
		3, 2, 10, -2, 13, 2, 11, 0,
		3, 2, 10, 1, 2, -1, 3, 0,
		4, 2, 10, 1, 12, 2, 13, -2, 11, 0,
		2, 1, 12, -2, 13, 2,
		3, 2, 10, 1, 3, -2, 5, 0,
		3, -2, 13, 1, 3, -1, 5, 0,
		3, 2, 10, 3, 2, -4, 3, 0,
		2, 1, 10, 1, 13, 0,
		3, 2, 10, 1, 3, -1, 5, 0,
		3, 2, 10, 2, 3, -2, 4, 0,
		2, 2, 10, 1, 12, 2,
		2, 1, 12, -2, 11, 0,
		3, -2, 13, 1, 2, -1, 3, 0,
		3, 1, 10, -1, 13, 2, 11, 0,
		3, 2, 10, 2, 2, -2, 3, 0,
		3, 1, 10, 1, 12, -3, 13, 0,
		3, 2, 13, -1, 11, 1, 14, 0,
		3, 2, 10, 2, 3, -3, 5, 0,
		3, 2, 10, 6, 2, -8, 3, 0,
		3, -3, 13, 18, 2, -16, 3, 1,
		3, 2, 13, 2, 5, -5, 6, 0,
		4, 2, 13, 4, 3, -8, 4, 3, 5, 0,
		1, 2, 13, 0,
		4, -2, 13, 4, 3, -8, 4, 3, 5, 0,
		3, -2, 13, 2, 5, -5, 6, 0,
		3, 1, 13, 18, 2, -16, 3, 1,
		3, -2, 13, -1, 11, 1, 14, 0,
		3, 2, 10, 2, 3, -2, 5, 0,
		3, 2, 10, 3, 2, -3, 3, 0,
		3, 1, 10, 1, 12, 1, 13, 1,
		2, 2, 10, 2, 12, 1,
		2, 1, 11, 1, 14, 1,
		4, -1, 13, -2, 11, 18, 2, -16, 3, 0,
		1, 2, 11, 0,
		4, -1, 13, 2, 11, 18, 2, -16, 3, 0,
		2, -3, 11, 1, 14, 0,
		3, 2, 13, 1, 2, -1, 3, 0,
		3, 2, 10, 4, 2, -4, 3, 0,
		3, 2, 10, 1, 12, -4, 13, 0,
		2, 1, 10, -3, 13, 0,
		3, 2, 13, 1, 3, -1, 5, 0,
		2, 1, 12, 2, 13, 2,
		3, 1, 10, 2, 12, 1, 13, 0,
		3, 1, 10, -1, 13, -2, 11, 0,
		2, 1, 12, 2, 11, 1,
		3, 2, 10, 5, 2, -5, 3, 0,
		2, 2, 10, -4, 13, 0,
		3, 2, 10, 6, 2, -6, 3, 0,
		2, 2, 12, 2, 13, 0,
		3, 2, 10, -2, 13, -2, 11, 0,
		2, 2, 12, 2, 11, 0,
		2, 2, 10, -4, 11, 0,
		3, 2, 10, 7, 2, -7, 3, 0,
		3, 2, 10, -1, 12, -4, 13, 0,
		4, 2, 10, -1, 12, -2, 13, -2, 11, 0,
		3, 2, 10, 8, 2, -8, 3, 0,
		3, 2, 10, 9, 2, -9, 3, 0,
		3, 4, 10, -3, 12, -1, 13, 0,
		3, 6, 10, -1, 12, -3, 13, 0,
		3, 4, 10, -2, 12, -1, 13, 1,
		3, 5, 10, -1, 12, -2, 13, 0,
		2, 6, 10, -3, 13, 0,
		4, 4, 10, -1, 12, 1, 13, -2, 11, 0,
		3, 2, 10, -3, 12, 1, 13, 0,
		2, 3, 10, -2, 12, 0,
		3, 4, 10, -1, 12, -1, 13, 1,
		2, 5, 10, -2, 13, 0,
		3, 6, 10, 1, 12, -3, 13, 0,
		3, 4, 10, 1, 13, -2, 11, 0,
		3, 2, 10, -2, 12, 1, 13, 1,
		2, 3, 10, -1, 12, 0,
		4, -2, 10, -1, 13, 2, 3, -2, 5, 0,
		2, 4, 10, -1, 13, 0,
		4, 2, 10, -2, 12, -1, 13, 2, 11, 0,
		3, 4, 10, -3, 13, 2, 11, 0,
		4, -2, 10, -1, 13, 2, 2, -2, 3, 0,
		3, 2, 10, -1, 12, 1, 13, 2,
		4, -2, 10, -1, 13, 1, 3, -1, 5, 0,
		1, 3, 10, 0,
		3, 4, 10, 1, 12, -1, 13, 1,
		4, 2, 10, -1, 12, -1, 13, 2, 11, 1,
		4, -2, 10, -1, 13, 1, 2, -1, 3, 0,
		3, 2, 10, 3, 13, -2, 11, 0,
		2, 2, 12, -3, 13, 0,
		3, 1, 10, -1, 12, 2, 13, 0,
		4, 2, 10, 1, 13, -1, 11, 1, 14, 0,
		4, -2, 10, -2, 13, 18, 2, -16, 3, 0,
		5, 2, 10, 1, 13, 4, 3, -8, 4, 3, 5, 0,
		2, 2, 10, 1, 13, 1,
		5, -2, 10, -1, 13, 4, 3, -8, 4, 3, 5, 0,
		3, 2, 10, 18, 2, -16, 3, 0,
		4, -2, 10, -1, 13, -1, 11, 1, 14, 0,
		4, 4, 10, -1, 13, 2, 3, -2, 5, 0,
		4, 4, 10, -1, 13, 3, 2, -3, 3, 0,
		2, 3, 10, 1, 12, 1,
		3, 4, 10, 2, 12, -1, 13, 0,
		4, 2, 10, -1, 13, 1, 11, 1, 14, 0,
		3, 2, 10, -1, 13, 2, 11, 0,
		2, 1, 12, -3, 13, 1,
		2, 1, 10, 2, 13, 0,
		3, 2, 10, 1, 12, 1, 13, 1,
		3, 1, 12, -1, 13, -2, 11, 1,
		2, 1, 10, 2, 11, 0,
		4, 2, 10, 1, 12, -1, 13, 2, 11, 0,
		1, 3, 13, 0,
		4, 2, 10, 1, 13, 2, 3, -2, 5, 0,
		3, 1, 10, 1, 12, 2, 13, 0,
		3, 2, 10, 2, 12, 1, 13, 0,
		3, 1, 13, 1, 11, 1, 14, 0,
		2, 1, 13, 2, 11, 0,
		3, 1, 10, 1, 12, 2, 11, 0,
		4, 2, 10, 2, 12, -1, 13, 2, 11, 0,
		2, 1, 13, -4, 11, 0,
		2, 1, 10, -4, 13, 0,
		2, 1, 12, 3, 13, 1,
		3, 1, 12, 1, 13, 2, 11, 1,
		2, 2, 10, -5, 13, 0,
		3, 2, 10, -3, 13, -2, 11, 0,
		3, 2, 10, -1, 13, -4, 11, 0,
		3, 6, 10, -2, 12, -2, 13, 0,
		2, 4, 10, -3, 12, 0,
		3, 6, 10, -1, 12, -2, 13, 0,
		2, 4, 10, -2, 12, 1,
		2, 6, 10, -2, 13, 0,
		2, 4, 10, -1, 12, 1,
		2, 5, 10, -1, 13, 0,
		3, 6, 10, 1, 12, -2, 13, 0,
		4, 4, 10, -1, 12, -2, 13, 2, 11, 0,
		3, 4, 10, 2, 13, -2, 11, 0,
		3, 2, 10, -2, 12, 2, 13, 0,
		1, 4, 10, 0,
		3, 2, 10, -2, 12, 2, 11, 0,
		3, 4, 10, -2, 13, 2, 11, 0,
		3, 2, 10, -1, 12, 2, 13, 1,
		2, 3, 10, 1, 13, 0,
		2, 4, 10, 1, 12, 1,
		3, 2, 10, -1, 12, 2, 11, 1,
		3, 3, 10, -1, 13, 2, 11, 0,
		2, 2, 10, 2, 13, 0,
		3, 3, 10, 1, 12, 1, 13, 0,
		3, 2, 10, 1, 11, 1, 14, 0,
		2, 2, 10, 2, 11, 0,
		2, 1, 12, -4, 13, 0,
		2, 1, 10, 3, 13, 0,
		3, 2, 10, 1, 12, 2, 13, 1,
		3, 1, 12, -2, 13, -2, 11, 0,
		3, 1, 10, 1, 13, 2, 11, 0,
		3, 2, 10, 1, 12, 2, 11, 0,
		1, 4, 13, 0,
		3, 1, 10, 1, 12, 3, 13, 0,
		2, 2, 13, 2, 11, 0,
		4, 1, 10, 1, 12, 1, 13, 2, 11, 0,
		1, 4, 11, 0,
		2, 1, 12, 4, 13, 0,
		3, 1, 12, 2, 13, 2, 11, 0,
		3, 2, 10, -4, 13, -2, 11, 0,
		3, 6, 10, -2, 12, -1, 13, 0,
		2, 8, 10, -3, 13, 0,
		3, 6, 10, -1, 12, -1, 13, 0,
		3, 4, 10, -2, 12, 1, 13, 0,
		2, 6, 10, -1, 13, 0,
		3, 4, 10, -1, 12, 1, 13, 1,
		3, 6, 10, 1, 12, -1, 13, 0,
		4, 4, 10, -1, 12, -1, 13, 2, 11, 0,
		3, 2, 10, -2, 12, 3, 13, 0,
		2, 4, 10, 1, 13, 0,
		3, 4, 10, -1, 13, 2, 11, 0,
		3, 2, 10, -1, 12, 3, 13, 0,
		3, 4, 10, 1, 12, 1, 13, 0,
		4, 2, 10, -1, 12, 1, 13, 2, 11, 0,
		2, 2, 10, 3, 13, 0,
		3, 2, 10, 1, 13, 2, 11, 0,
		3, 2, 10, -1, 13, 4, 11, 0,
		3, 2, 10, 1, 12, 3, 13, 0,
		3, 1, 12, -3, 13, -2, 11, 0,
		3, 1, 10, 2, 13, 2, 11, 0,
		4, 2, 10, 1, 12, 1, 13, 2, 11, 0,
		1, 5, 13, 0,
		2, 3, 13, 2, 11, 0,
		2, 1, 13, 4, 11, 0,
		3, 1, 12, 3, 13, 2, 11, 0,
		2, 8, 10, -2, 13, 0,
		2, 6, 10, -1, 12, 0,
		1, 6, 10, 0,
		3, 6, 10, -2, 13, 2, 11, 0,
		3, 4, 10, -1, 12, 2, 13, 0,
		3, 4, 10, -1, 12, 2, 11, 0,
		2, 4, 10, 2, 13, 0,
		2, 4, 10, 2, 11, 0,
		3, 2, 10, -1, 12, 4, 13, 0,
		3, 4, 10, 1, 12, 2, 13, 0,
		4, 2, 10, -1, 12, 2, 13, 2, 11, 0,
		2, 2, 10, 4, 13, 0,
		3, 2, 10, 2, 13, 2, 11, 0,
		2, 2, 10, 4, 11, 0,
		1, 6, 13, 0,
		2, 4, 13, 2, 11, 0,
		2, 2, 13, 4, 11, 0,
		3, 6, 10, -1, 12, 1, 13, 0,
		2, 6, 10, 1, 13, 0,
		2, 4, 10, 3, 13, 0,
		3, 4, 10, 1, 13, 2, 11, 0,
		2, 2, 10, 5, 13, 0,
		3, 2, 10, 3, 13, 2, 11, 0,
		-1
	]
};
// moonlat.js
$ns.moonlat = {
	maxargs: 14,
	max_harmonic: [0, 26, 29, 8, 3, 5, 0, 0, 0, 6, 5, 3, 5, 1, 0, 0, 0, 0],
	max_power_of_t: 3,
	distance: 2.5735686895300000e-03,
	timescale: 3.6525000000000000e+06,
	trunclvl: 1.0000000000000000e-04,
	lon_tbl: [
		-3, -4,
		4, -1856, 0, 8043,
		-9, -1082,
		-1, -310,
		-1, -522,
		-330, -1449, -853, 4656,
		-66, 7,
		-1, 9996928,
		-66, 6,
		23, 183,
		0, 173,
		0, -56,
		0, 50,
		0, -785,
		1, 51,
		0, -60,
		1, 11843, 0, -50754,
		0, 1834, 1, -7910,
		0, -48060,
		1, 56,
		0, 13141, -1, -56318,
		0, 2541,
		-1, -649,
		-133, 778,
		-46, 8,
		1, 1665737,
		-47, 7,
		0, 65,
		0, 45,
		0, -138,
		0, -1005,
		0, -2911,
		0, -47,
		0, 96,
		0, -394,
		2, 76,
		2, -17302, 0, 74337,
		0, -101,
		0, 58,
		0, -171,
		0, -77,
		0, -1283, 0, 2686,
		0, -55,
		0, 99,
		0, 55,
		0, 397,
		0, 540,
		0, 626,
		-1, -5188, 0, 10857,
		0, -216,
		-2, -123,
		0, 6337,
		2, 224,
		-152, -23472, -29, -74336, 0, 295775,
		-20, 149,
		-2, 84,
		9, 304,
		0, -3051,
		-70, -6,
		-57, 34,
		0, -638,
		0, -201,
		-73, 9,
		0, -100,
		-101, -8,
		0, -57,
		0, -207,
		-3, 80,
		-45, 45,
		-5, 102,
		-59, -23,
		52, 201,
		-48, 233, -220, 71,
		4, 2810, 0, 6236541,
		-61, 218, -216, 67,
		51, 201,
		-59, -23,
		-144, -837, -457, 3029,
		-45, 42,
		-15, 73,
		-6, -169,
		0, 135,
		-64, -7,
		0, -16245,
		0, -81,
		-74, -10,
		0, 702, 0, -3013,
		0, -5889,
		1, 141,
		58, 9598, 12, 30443, 1, -120946,
		-1, -84,
		-2, 11246, -1, -48391,
		0, 1393,
		0, 200,
		-136, -17,
		0, 558,
		-64, -8,
		0, -71,
		0, 317577,
		-28, 183,
		1, 219,
		0, 421,
		0, -133,
		501, -139,
		3, 354,
		-101, -13,
		74, 7,
		144, -84,
		59, -2,
		1, 64,
		-2931, 12559, -4641, 2638, -303, -2058,
		-13, -100, -123, -79,
		-19214, 6084, 1494, 26993, 15213, -82219,
		42, 52, 48, -101,
		-53, -4,
		4, 47,
		58, -131,
		46, 14,
		-21, -6,
		-1311, -8791, 10198, -4185, 2815, 5640,
		167, 422, -229, 83,
		3140, 39, 1221, 120, 96, -30,
		-1, 184612405,
		187, 416, -226, 81,
		-1985, -10083, 9983, -4464, 2807, 5643,
		-21, -9,
		113, -367,
		120, 580, -667, 27,
		8, 66,
		-56, -6,
		337, 95,
		-87, 3303,
		-1, 65,
		68, -374,
		0, -574,
		15, -94,
		0, -53,
		0, -1303,
		0, -236,
		283, 36,
		-1, -54,
		269, -35,
		0, -83,
		0, -52,
		0, 730, 0, -3129,
		0, 813,
		0, -4299,
		1, 59,
		-6, 5130, 1, 16239, -1, -64603,
		0, -80,
		91, 12,
		0, -561,
		133, -17,
		0, 250,
		-12, 71,
		0, 155664,
		82, -11,
		0, 106,
		0, -604,
		0, 21862,
		55, -7,
		0, -1514, 0, 6501,
		0, 906,
		0, -68,
		0, 241,
		0, 366,
		0, 70,
		0, -1382, 0, 5957,
		0, 113,
		0, -51,
		0, -55,
		0, 731,
		0, -264,
		0, 65788,
		1, -1504, 0, 3147,
		0, 217,
		0, -4105, 0, 17658,
		1, 69,
		0, -3518,
		0, -1767,
		-43, -7044, -10, -22304, 0, 88685,
		3, 91,
		0, -485,
		0, -57,
		-1, 333548,
		-24, 172,
		11, 544, 1, -1132,
		0, 353,
		0, -188,
		0, 53,
		0, 77,
		158, -887,
		35, 131,
		-54, 13,
		0, 1994821,
		-53, 14,
		36, 125,
		2, 56,
		0, -243,
		0, -364,
		-2, 1916, 0, -8227,
		0, 15700, -1, -67308,
		1, 66,
		0, -53686,
		1, 3058, 1, -13177,
		0, -72,
		0, -72,
		0, 61,
		0, 15812,
		0, 165,
		8, -96,
		318, 1341, 803, -4252,
		24, 193,
		1137, -226, 310, 622,
		-56, 30,
		-3, 10101666,
		-56, 30,
		1096, -225, 300, 600,
		-31, 409,
		-1, -507,
		0, -287,
		0, -1869, 0, 8026,
		1, 544, -1, -1133,
		0, 27984,
		0, -62,
		0, -249,
		0, 187,
		0, -1096,
		1, 53,
		2, 12388, 0, -53107,
		0, -322,
		0, -94,
		0, 15157,
		0, -582,
		0, 3291,
		0, 565,
		0, 106,
		0, 112,
		0, 306,
		0, 809,
		0, 130,
		0, -961, 0, 4149,
		0, 174,
		0, -105,
		0, 2196,
		0, 59,
		0, 36737,
		-1, -1832, 0, 3835,
		0, -139,
		0, 24138,
		0, 1325,
		1, 64,
		0, -361,
		0, -1162,
		-44, -6320, -10, -20003, 0, 79588,
		2, 80,
		0, -2059,
		0, -304,
		0, 21460,
		0, -166,
		0, -87,
		89, -493,
		32, 114,
		34, 510, 1, 1172616,
		31, 113,
		-1, 57,
		0, 214,
		0, -656,
		0, -646,
		0, 1850, 0, -7931,
		0, -6674,
		0, 2944, 0, -12641,
		0, 916,
		45, -255,
		16, 60,
		-1, 619116,
		16, 57,
		0, -58,
		0, 1045,
		0, -156,
		-15, 88,
		0, -62964,
		0, -126,
		0, 1490, 0, -6387,
		0, 119,
		0, 1338,
		0, -56,
		0, 204,
		0, 153,
		0, 940,
		0, 251,
		0, 312,
		0, 584,
		0, -786, 0, 3388,
		0, -52,
		0, 4733,
		0, 618,
		0, 29982,
		0, 101,
		0, -174,
		0, -2637, 0, 11345,
		0, -284,
		0, -524,
		0, -121,
		0, 1464,
		11, -60,
		-1, 151205,
		0, 139,
		0, -2448,
		0, -51,
		0, -768,
		0, -638,
		0, 552, 0, -2370,
		0, 70,
		0, 64,
		0, 57,
		0, 39840,
		0, 104,
		0, -10194,
		0, -635,
		0, 69,
		0, 113,
		0, 67,
		0, 96,
		0, 367,
		0, 134,
		0, 596,
		0, 63,
		0, 1622,
		0, 483,
		0, 72,
		0, 11917,
		0, -63,
		0, 1273,
		0, -66,
		0, -262,
		0, -97,
		0, 103,
		0, 15196,
		0, -1445,
		0, -66,
		0, -55,
		0, -323,
		0, 2632,
		0, -1179,
		0, 59,
		0, -56,
		0, 78,
		0, 65,
		0, 422,
		0, 309,
		0, 2125,
		0, -66,
		0, 124,
		0, -57,
		0, 1379,
		0, -304,
		0, 177,
		0, -118,
		0, 146,
		0, 283,
		0, 119
	],
	lat_tbl: [],
	rad_tbl: [],
	arg_tbl: [
		0, 1,
		3, 1, 10, 1, 12, -1, 11, 1,
		4, 2, 10, 2, 12, -1, 13, -1, 11, 0,
		5, 2, 10, -1, 13, -1, 11, 3, 2, -3, 3, 0,
		5, 2, 10, -1, 13, -1, 11, 2, 3, -2, 5, 0,
		2, -1, 13, 1, 14, 1,
		5, -1, 13, 1, 11, 4, 3, -8, 4, 3, 5, 0,
		2, 1, 13, -1, 11, 0,
		5, 1, 13, -1, 11, 4, 3, -8, 4, 3, 5, 0,
		5, 2, 10, -1, 13, -1, 11, 2, 3, -3, 5, 0,
		4, 1, 10, 1, 12, -2, 13, 1, 11, 0,
		4, 1, 13, -1, 11, 1, 2, -1, 3, 0,
		5, 2, 10, -1, 13, -1, 11, 2, 2, -2, 3, 0,
		3, 1, 10, -2, 13, 1, 11, 0,
		4, 1, 13, -1, 11, 1, 3, -1, 5, 0,
		4, -1, 13, 1, 11, 1, 2, -1, 3, 0,
		3, 1, 12, 1, 13, -1, 11, 1,
		4, 2, 10, 1, 12, -1, 13, -1, 11, 1,
		2, 1, 10, -1, 11, 0,
		4, -1, 13, 1, 11, 1, 3, -1, 5, 0,
		3, 1, 12, -1, 13, 1, 11, 1,
		3, 2, 10, -3, 13, 1, 11, 0,
		3, 2, 12, 1, 13, -1, 11, 0,
		3, -2, 10, 1, 13, 1, 14, 0,
		6, -2, 10, 1, 13, 1, 11, 4, 3, -8, 4, 3, 5, 0,
		3, 2, 10, -1, 13, -1, 11, 0,
		6, 2, 10, -1, 13, -1, 11, 4, 3, -8, 4, 3, 5, 0,
		4, -1, 13, 1, 11, 2, 3, -2, 5, 0,
		4, -1, 13, 1, 11, 3, 2, -3, 3, 0,
		3, 1, 10, -1, 12, -1, 11, 0,
		3, 2, 12, -1, 13, 1, 11, 0,
		3, 2, 10, 1, 13, -3, 11, 0,
		5, -2, 10, 1, 13, 1, 11, 1, 2, -1, 3, 0,
		4, 2, 10, -1, 12, -3, 13, 1, 11, 0,
		3, 3, 10, -2, 13, -1, 11, 0,
		5, -2, 10, 1, 13, 1, 11, 1, 3, -1, 5, 0,
		4, 2, 10, -1, 12, -1, 13, -1, 11, 1,
		2, 3, 10, -3, 11, 0,
		5, -2, 10, 1, 13, 1, 11, 2, 2, -2, 3, 0,
		4, 2, 10, -1, 12, 1, 13, -3, 11, 0,
		3, 4, 10, -3, 13, -1, 11, 0,
		4, 2, 10, -2, 12, -1, 13, -1, 11, 1,
		3, 4, 10, -1, 13, -3, 11, 0,
		4, 2, 10, -3, 12, -1, 13, -1, 11, 0,
		3, 4, 10, -1, 12, -3, 11, 0,
		3, 2, 10, -3, 12, -1, 11, 0,
		4, 4, 10, -1, 12, -2, 13, -1, 11, 0,
		2, 4, 10, -3, 11, 0,
		3, 2, 10, -2, 12, -1, 11, 1,
		4, 3, 10, -1, 12, -1, 13, -1, 11, 0,
		4, -2, 10, 1, 11, 2, 3, -2, 5, 0,
		3, 4, 10, -2, 13, -1, 11, 0,
		4, -2, 10, 1, 11, 2, 2, -2, 3, 0,
		3, 2, 10, -1, 12, -1, 11, 2,
		3, -2, 10, 1, 12, 1, 14, 0,
		4, -2, 10, 1, 11, 2, 3, -2, 4, 0,
		4, -2, 10, 1, 11, 1, 3, -1, 5, 0,
		3, 3, 10, -1, 13, -1, 11, 0,
		4, -2, 10, 1, 11, 3, 2, -4, 3, 0,
		4, -2, 10, 1, 11, 1, 3, -2, 5, 0,
		4, 2, 10, -1, 12, -2, 13, 1, 11, 0,
		4, -2, 10, 1, 11, 1, 2, -1, 3, 0,
		2, -1, 10, 1, 2, 0,
		3, 2, 10, 2, 13, -3, 11, 0,
		4, -2, 10, 1, 11, 2, 2, -3, 3, 0,
		3, 2, 12, -2, 13, 1, 11, 0,
		4, 1, 10, -1, 12, 1, 13, -1, 11, 0,
		3, -2, 10, 1, 11, 1, 5, 0,
		4, 2, 10, -1, 11, 1, 3, -2, 4, 0,
		3, 2, 10, -2, 11, 1, 14, 0,
		4, -2, 10, 1, 11, 8, 2, -13, 3, 0,
		5, -2, 10, -1, 13, 1, 11, 18, 2, -16, 3, 0,
		5, 2, 10, -1, 11, 4, 3, -8, 4, 3, 5, 1,
		2, 2, 10, -1, 11, 1,
		5, -2, 10, 1, 11, 4, 3, -8, 4, 3, 5, 1,
		5, 2, 10, -1, 13, -1, 11, 18, 2, -16, 3, 0,
		4, 2, 10, -1, 11, 8, 2, -13, 3, 0,
		2, -2, 10, 1, 14, 1,
		4, -2, 10, 1, 11, 1, 3, -2, 4, 0,
		3, 2, 10, -1, 11, 1, 5, 0,
		2, 2, 12, -1, 11, 0,
		4, 3, 10, 1, 12, -1, 13, -1, 11, 0,
		4, 2, 10, -1, 11, 2, 2, -3, 3, 0,
		3, 2, 10, -2, 13, 1, 11, 0,
		4, 2, 10, -1, 11, 1, 2, -1, 3, 0,
		3, 1, 10, 1, 2, -2, 3, 0,
		3, 1, 12, -2, 13, 1, 11, 1,
		3, 1, 10, 1, 13, -1, 11, 0,
		4, 2, 10, -1, 11, 1, 3, -1, 5, 0,
		3, 2, 10, 1, 12, -1, 11, 2,
		3, -2, 10, -1, 12, 1, 14, 0,
		2, 1, 12, -1, 11, 1,
		3, 1, 10, -1, 13, 1, 11, 0,
		4, 2, 10, -1, 11, 2, 2, -2, 3, 0,
		3, 1, 10, 2, 2, -3, 3, 0,
		4, 2, 10, 1, 12, -2, 13, 1, 11, 0,
		3, -1, 10, 1, 2, -2, 3, 0,
		3, -1, 11, 1, 2, -1, 3, 0,
		2, 2, 13, -1, 11, 0,
		2, -2, 13, 1, 14, 0,
		4, 2, 10, -1, 11, 2, 3, -2, 5, 0,
		4, 2, 10, -1, 11, 3, 2, -3, 3, 0,
		4, 2, 10, 2, 12, -2, 13, -1, 11, 0,
		3, 1, 10, 1, 3, -2, 5, 0,
		4, 1, 10, 1, 12, 1, 13, -1, 11, 0,
		3, 1, 10, 3, 2, -4, 3, 0,
		3, 1, 10, 1, 3, -1, 5, 0,
		3, 1, 10, 1, 3, -2, 6, 0,
		3, 1, 10, 2, 3, -2, 4, 0,
		4, 1, 10, 1, 12, -1, 13, -1, 11, 0,
		3, 2, 10, 2, 12, -1, 11, 2,
		4, 1, 10, 1, 3, 2, 5, -5, 6, 1,
		1, 1, 14, 2,
		3, 1, 10, 8, 2, -12, 3, 1,
		5, -2, 10, 1, 13, -1, 11, 20, 2, -21, 3, 0,
		5, 2, 10, -2, 13, 1, 11, 2, 3, -3, 5, 0,
		3, 1, 10, 1, 3, 1, 6, 0,
		4, -1, 13, -1, 11, 26, 2, -29, 3, 0,
		3, -1, 11, 8, 2, -13, 3, 0,
		4, -1, 13, -1, 11, 18, 2, -16, 3, 2,
		4, -1, 13, 1, 11, 10, 2, -3, 3, 1,
		1, 1, 11, 3,
		4, -1, 13, -1, 11, 10, 2, -3, 3, 1,
		4, -1, 13, 1, 11, 18, 2, -16, 3, 2,
		3, 1, 11, 8, 2, -13, 3, 0,
		2, 1, 10, 2, 4, 0,
		4, 2, 10, -1, 11, 5, 2, -6, 3, 1,
		5, 2, 10, -2, 13, -1, 11, 2, 3, -3, 5, 0,
		5, -2, 10, 1, 13, 1, 11, 20, 2, -21, 3, 0,
		3, 1, 10, 1, 3, 1, 5, 0,
		2, -2, 11, 1, 14, 0,
		5, 2, 10, -2, 13, 1, 11, 2, 3, -2, 5, 0,
		3, 1, 10, 5, 2, -7, 3, 0,
		4, 1, 10, 1, 12, -1, 13, 1, 11, 0,
		3, 1, 10, 2, 2, -2, 3, 0,
		4, 2, 10, 2, 12, -2, 13, 1, 11, 0,
		2, 2, 13, -3, 11, 0,
		4, 2, 10, -1, 11, 4, 2, -4, 3, 0,
		3, 1, 10, 4, 2, -5, 3, 0,
		3, 1, 10, -3, 13, 1, 11, 0,
		2, 1, 10, 1, 2, 0,
		3, 1, 11, 1, 2, -1, 3, 0,
		4, 2, 10, -1, 11, 3, 3, -3, 5, 0,
		3, 1, 12, 2, 13, -1, 11, 1,
		4, 2, 10, 1, 12, -2, 13, -1, 11, 0,
		3, 1, 10, -1, 13, -1, 11, 0,
		3, 1, 11, 1, 3, -1, 5, 0,
		2, 1, 12, 1, 11, 2,
		4, 2, 10, -1, 11, 5, 2, -5, 3, 0,
		3, 1, 10, 5, 2, -6, 3, 0,
		3, 2, 10, 1, 12, -3, 11, 0,
		3, 1, 10, 2, 2, -1, 3, 0,
		3, 2, 10, -4, 13, 1, 11, 0,
		3, -2, 10, 2, 13, 1, 14, 0,
		3, 2, 10, -2, 13, -1, 11, 0,
		3, 1, 10, 3, 2, -2, 3, 0,
		4, 1, 10, -1, 12, -1, 13, -1, 11, 0,
		2, 2, 12, 1, 11, 0,
		2, 2, 10, -3, 11, 0,
		3, 1, 10, 4, 2, -3, 3, 0,
		4, 2, 10, -1, 12, -2, 13, -1, 11, 1,
		3, 2, 10, -1, 12, -3, 11, 0,
		3, 4, 10, -4, 13, -1, 11, 0,
		4, 2, 10, -2, 12, -2, 13, -1, 11, 0,
		4, 4, 10, -2, 12, -1, 13, -1, 11, 0,
		3, 6, 10, -3, 13, -1, 11, 0,
		4, 4, 10, -1, 12, -1, 13, -1, 11, 1,
		4, 2, 10, -3, 12, -1, 13, 1, 11, 0,
		3, 5, 10, -2, 13, -1, 11, 0,
		3, 4, 10, 1, 13, -3, 11, 0,
		4, 2, 10, -2, 12, 1, 13, -1, 11, 0,
		3, 3, 10, -1, 12, -1, 11, 0,
		3, 4, 10, -1, 13, -1, 11, 0,
		4, 2, 10, -2, 12, -1, 13, 1, 11, 1,
		3, 4, 10, -3, 13, 1, 11, 0,
		4, 2, 10, -1, 12, 1, 13, -1, 11, 1,
		5, -2, 10, 1, 13, -1, 11, 2, 2, -2, 3, 0,
		2, 3, 10, -1, 11, 0,
		4, 4, 10, 1, 12, -1, 13, -1, 11, 0,
		4, 2, 10, -1, 12, -1, 13, 1, 11, 2,
		5, -2, 10, 1, 13, -1, 11, 1, 3, -1, 5, 0,
		3, 3, 10, -2, 13, 1, 11, 0,
		5, -2, 10, 1, 13, -1, 11, 1, 2, -1, 3, 0,
		3, 2, 10, 1, 13, -1, 11, 0,
		3, -2, 10, -1, 13, 1, 14, 0,
		3, 2, 12, -1, 13, -1, 11, 1,
		3, 3, 10, 1, 12, -1, 11, 0,
		3, 1, 10, -1, 12, 1, 11, 0,
		4, -1, 13, -1, 11, 3, 2, -3, 3, 0,
		4, -1, 13, -1, 11, 2, 3, -2, 5, 0,
		3, 2, 10, -1, 13, 1, 14, 0,
		4, -2, 10, -1, 11, 18, 2, -16, 3, 0,
		6, 2, 10, -1, 13, 1, 11, 4, 3, -8, 4, 3, 5, 0,
		3, 2, 10, -1, 13, 1, 11, 0,
		6, -2, 10, 1, 13, -1, 11, 4, 3, -8, 4, 3, 5, 0,
		5, 2, 10, -2, 13, 1, 11, 18, 2, -16, 3, 0,
		4, -2, 10, 1, 13, -2, 11, 1, 14, 0,
		3, 1, 12, -3, 13, 1, 11, 0,
		3, 1, 10, 2, 13, -1, 11, 0,
		4, 2, 10, 1, 12, 1, 13, -1, 11, 1,
		3, 1, 12, -1, 13, -1, 11, 1,
		4, -1, 13, -1, 11, 1, 3, -1, 5, 0,
		2, 1, 10, 1, 11, 0,
		4, 2, 10, 1, 12, -1, 13, 1, 11, 1,
		3, 1, 12, 1, 13, -3, 11, 0,
		4, -1, 13, -1, 11, 1, 2, -1, 3, 0,
		5, 2, 10, -1, 13, 1, 11, 2, 2, -2, 3, 0,
		2, 3, 13, -1, 11, 0,
		4, 1, 10, 1, 12, -2, 13, -1, 11, 0,
		4, 2, 10, 2, 12, 1, 13, -1, 11, 0,
		2, 1, 13, 1, 14, 1,
		5, 2, 10, -1, 13, 1, 11, 2, 3, -3, 5, 0,
		4, -2, 13, -1, 11, 18, 2, -16, 3, 1,
		5, 1, 13, 1, 11, 4, 3, -8, 4, 3, 5, 0,
		2, 1, 13, 1, 11, 0,
		5, -1, 13, -1, 11, 4, 3, -8, 4, 3, 5, 0,
		3, 1, 11, 18, 2, -16, 3, 1,
		3, -1, 13, -2, 11, 1, 14, 0,
		5, 2, 10, -1, 13, 1, 11, 2, 3, -2, 5, 0,
		5, 2, 10, -1, 13, 1, 11, 3, 2, -3, 3, 0,
		3, 1, 10, 1, 12, 1, 11, 1,
		4, 2, 10, 2, 12, -1, 13, 1, 11, 1,
		2, 1, 13, -3, 11, 0,
		4, 1, 13, 1, 11, 1, 2, -1, 3, 0,
		3, 1, 12, 3, 13, -1, 11, 0,
		4, 2, 10, 1, 12, -3, 13, -1, 11, 0,
		3, 1, 10, -2, 13, -1, 11, 0,
		4, 1, 13, 1, 11, 1, 3, -1, 5, 0,
		3, 1, 12, 1, 13, 1, 11, 1,
		2, 1, 10, -3, 11, 0,
		3, 1, 12, -1, 13, 3, 11, 0,
		3, 2, 10, -3, 13, -1, 11, 0,
		3, 2, 12, 1, 13, 1, 11, 0,
		3, 2, 10, -1, 13, -3, 11, 0,
		4, 2, 10, -1, 12, -3, 13, -1, 11, 0,
		4, 2, 10, -1, 12, -1, 13, -3, 11, 0,
		4, 6, 10, -1, 12, -2, 13, -1, 11, 0,
		3, 4, 10, -2, 12, -1, 11, 0,
		3, 6, 10, -2, 13, -1, 11, 0,
		4, 4, 10, -2, 12, -2, 13, 1, 11, 0,
		3, 4, 10, -1, 12, -1, 11, 1,
		3, 2, 10, -3, 12, 1, 11, 0,
		3, 5, 10, -1, 13, -1, 11, 0,
		4, 4, 10, -1, 12, -2, 13, 1, 11, 0,
		4, 2, 10, -2, 12, 2, 13, -1, 11, 0,
		2, 4, 10, -1, 11, 0,
		3, 2, 10, -2, 12, 1, 11, 1,
		4, 3, 10, -1, 12, -1, 13, 1, 11, 0,
		3, 4, 10, -2, 13, 1, 11, 0,
		4, 2, 10, -1, 12, 2, 13, -1, 11, 0,
		4, -2, 10, -1, 11, 2, 2, -2, 3, 0,
		3, 3, 10, 1, 13, -1, 11, 0,
		3, 4, 10, 1, 12, -1, 11, 0,
		3, 2, 10, -1, 12, 1, 11, 2,
		4, -2, 10, -1, 11, 1, 3, -1, 5, 0,
		3, 3, 10, -1, 13, 1, 11, 0,
		4, 4, 10, 1, 12, -2, 13, 1, 11, 0,
		3, 2, 10, 2, 13, -1, 11, 0,
		3, 2, 12, -2, 13, -1, 11, 0,
		4, 1, 10, -1, 12, 1, 13, 1, 11, 0,
		2, 2, 10, 1, 14, 0,
		5, -2, 10, -1, 13, -1, 11, 18, 2, -16, 3, 0,
		2, 2, 10, 1, 11, 1,
		5, 2, 10, -1, 13, 1, 11, 18, 2, -16, 3, 0,
		3, -2, 10, -2, 11, 1, 14, 0,
		4, 3, 10, 1, 12, -1, 13, 1, 11, 0,
		3, 2, 10, -2, 13, 3, 11, 0,
		4, 2, 10, 1, 12, 2, 13, -1, 11, 0,
		3, 1, 12, -2, 13, -1, 11, 1,
		3, 1, 10, 1, 13, 1, 11, 0,
		3, 2, 10, 1, 12, 1, 11, 1,
		2, 4, 13, -1, 11, 0,
		2, 2, 13, 1, 14, 0,
		4, -3, 13, -1, 11, 18, 2, -16, 3, 0,
		2, 2, 13, 1, 11, 0,
		4, 1, 13, 1, 11, 18, 2, -16, 3, 0,
		4, 2, 10, 1, 11, 2, 3, -2, 5, 0,
		4, 1, 10, 1, 12, 1, 13, 1, 11, 0,
		3, 2, 10, 2, 12, 1, 11, 0,
		2, 2, 11, 1, 14, 0,
		1, 3, 11, 0,
		3, 1, 10, -3, 13, -1, 11, 0,
		3, 1, 12, 2, 13, 1, 11, 1,
		2, 1, 12, 3, 11, 0,
		3, 2, 10, -4, 13, -1, 11, 0,
		3, 2, 12, 2, 13, 1, 11, 0,
		3, 2, 10, -2, 13, -3, 11, 0,
		4, 6, 10, -1, 12, -1, 13, -1, 11, 0,
		3, 6, 10, -1, 13, -1, 11, 0,
		4, 4, 10, -2, 12, -1, 13, 1, 11, 0,
		3, 6, 10, -3, 13, 1, 11, 0,
		4, 4, 10, -1, 12, 1, 13, -1, 11, 0,
		4, 4, 10, -1, 12, -1, 13, 1, 11, 1,
		3, 5, 10, -2, 13, 1, 11, 0,
		3, 4, 10, 1, 13, -1, 11, 0,
		4, 2, 10, -2, 12, 1, 13, 1, 11, 0,
		3, 4, 10, -1, 13, 1, 11, 0,
		4, 2, 10, -1, 12, 3, 13, -1, 11, 0,
		4, 4, 10, 1, 12, 1, 13, -1, 11, 0,
		4, 2, 10, -1, 12, 1, 13, 1, 11, 1,
		2, 3, 10, 1, 11, 0,
		4, 4, 10, 1, 12, -1, 13, 1, 11, 0,
		4, 2, 10, -1, 12, -1, 13, 3, 11, 0,
		3, 2, 10, 3, 13, -1, 11, 0,
		3, 2, 10, 1, 13, 1, 14, 0,
		3, 2, 10, 1, 13, 1, 11, 0,
		3, 3, 10, 1, 12, 1, 11, 0,
		3, 2, 10, -1, 13, 3, 11, 0,
		4, 2, 10, 1, 12, 3, 13, -1, 11, 0,
		3, 1, 12, -3, 13, -1, 11, 0,
		3, 1, 10, 2, 13, 1, 11, 0,
		4, 2, 10, 1, 12, 1, 13, 1, 11, 1,
		3, 1, 12, -1, 13, -3, 11, 0,
		2, 1, 10, 3, 11, 0,
		2, 5, 13, -1, 11, 0,
		2, 3, 13, 1, 11, 0,
		4, 1, 10, 1, 12, 2, 13, 1, 11, 0,
		2, 1, 13, 3, 11, 0,
		3, 1, 12, 3, 13, 1, 11, 0,
		3, 1, 12, 1, 13, 3, 11, 0,
		3, 2, 10, -5, 13, -1, 11, 0,
		3, 6, 10, -1, 12, -1, 11, 0,
		4, 6, 10, -1, 12, -2, 13, 1, 11, 0,
		2, 6, 10, -1, 11, 0,
		3, 4, 10, -2, 12, 1, 11, 0,
		3, 6, 10, -2, 13, 1, 11, 0,
		4, 4, 10, -1, 12, 2, 13, -1, 11, 0,
		3, 4, 10, -1, 12, 1, 11, 0,
		3, 4, 10, 2, 13, -1, 11, 0,
		4, 2, 10, -2, 12, 2, 13, 1, 11, 0,
		2, 4, 10, 1, 11, 0,
		3, 4, 10, -2, 13, 3, 11, 0,
		4, 2, 10, -1, 12, 2, 13, 1, 11, 0,
		3, 3, 10, 1, 13, 1, 11, 0,
		3, 4, 10, 1, 12, 1, 11, 0,
		3, 2, 10, -1, 12, 3, 11, 0,
		3, 2, 10, 4, 13, -1, 11, 0,
		3, 2, 10, 2, 13, 1, 11, 0,
		2, 2, 10, 3, 11, 0,
		3, 1, 12, -4, 13, -1, 11, 0,
		3, 1, 10, 3, 13, 1, 11, 0,
		4, 2, 10, 1, 12, 2, 13, 1, 11, 0,
		2, 4, 13, 1, 11, 0,
		2, 2, 13, 3, 11, 0,
		1, 5, 11, 0,
		3, 1, 12, 4, 13, 1, 11, 0,
		4, 6, 10, -1, 12, -1, 13, 1, 11, 0,
		3, 6, 10, 1, 13, -1, 11, 0,
		3, 6, 10, -1, 13, 1, 11, 0,
		4, 4, 10, -1, 12, 1, 13, 1, 11, 0,
		3, 4, 10, 1, 13, 1, 11, 0,
		3, 4, 10, -1, 13, 3, 11, 0,
		4, 2, 10, -1, 12, 3, 13, 1, 11, 0,
		4, 4, 10, 1, 12, 1, 13, 1, 11, 0,
		3, 2, 10, 3, 13, 1, 11, 0,
		3, 2, 10, 1, 13, 3, 11, 0,
		2, 5, 13, 1, 11, 0,
		2, 3, 13, 3, 11, 0,
		2, 6, 10, 1, 11, 0,
		3, 4, 10, 2, 13, 1, 11, 0,
		3, 2, 10, 4, 13, 1, 11, 0,
		-1
	]
};
// mars.js
$ns.mars = {
	maxargs: 9,
	max_harmonic: [0, 5, 12, 24, 9, 7, 3, 2, 0],
	max_power_of_t: 5,
	distance: 1.5303348827100001e+00,
	timescale: 3652500.0,
	trunclvl: 1.0,
	lon_tbl: [
		43471.66140, 21291.11063, 2033.37848, 6890507597.78366,
		1279543.73631,
		317.74183, 730.69258, -15.26502, 277.56960,
		-62.96711, 20.96285,
		1.01857, -2.19395,
		3.75708, 3.65854, 0.01049, 1.09183,
		-0.00605, -0.04769,
		0.41839, 0.10091, 0.03887, 0.11666,
		-0.03301, 0.02664,
		0.38777, -0.56974,
		0.02974, -0.15041, 0.02179, -0.00808,
		0.08594, 0.09773,
		-0.00902, -0.04597, 0.00762, -0.03858,
		-0.00139, 0.01562,
		0.02019, 0.01878,
		-0.01244, 0.00795,
		0.00815, 0.03501,
		-0.00335, -0.02970,
		-0.00518, -0.01763,
		0.17257, 0.14698, -0.14417, 0.26028,
		0.00062, -0.00180,
		13.35262, 39.38771, -15.49558, 22.00150,
		-7.71321, -4.20035, 0.62074, -1.42376,
		0.07043, -0.06670, 0.16960, -0.06859,
		0.07787, 0.01845,
		-0.01608, -0.00914,
		5.60438, -3.44436, 5.88876, 6.77238,
		-5.29704, 3.48944,
		0.01291, 0.01280,
		-0.53532, 0.86584, 0.79604, 0.31635,
		-3.92977, -0.94829, -0.74254, -1.37947,
		0.17871, -0.12477,
		0.00171, 0.11537,
		0.02281, -0.03922,
		-0.00165, 0.02965,
		1.59773, 1.24565, -0.35802, 1.37272,
		-0.44811, -0.08611,
		3.04184, -3.39729, 8.86270, 6.65967,
		-9.10580, 10.66103,
		0.02015, -0.00902,
		-0.01166, -0.23957, -0.12128, -0.04640,
		-0.07114, 0.14053, -0.04966, -0.01665,
		0.28411, -0.37754, -1.26265, 1.01377,
		3.70433, -0.21025,
		-0.00972, 0.00350,
		0.00997, 0.00450,
		-2.15305, 3.18147, -1.81957, -0.02321,
		-0.02560, -0.35188,
		0.00003, -0.01110,
		0.00244, -0.05083,
		-0.00216, -0.02026,
		0.05179, 0.04188,
		5.92031, -1.61316, 3.72001, 6.98783,
		-4.17690, 2.61250,
		0.04157, 2.76453, -1.34043, 0.74586,
		-0.20258, -0.30467,
		0.00733, 0.00376,
		1.72800, 0.76593, 1.26577, -2.02682,
		-1.14637, -0.91894,
		-0.00002, 0.00036,
		2.54213, 0.89533, -0.04166, 2.36838,
		-0.97069, 0.05486,
		0.46927, 0.04500, 0.23388, 0.35005,
		1.61402, 2.30209, -0.99859, 1.63349,
		-0.51490, -0.26112,
		0.27848, -0.26100, -0.07645, -0.22001,
		0.92901, 1.12627, -0.39829, 0.77120,
		-0.23716, -0.11245,
		-0.02387, 0.03960,
		-0.00802, 0.02179,
		2.86448, 1.00246, -0.14647, 2.80278,
		-1.14143, 0.05177,
		1.68671, -1.23451, 3.16285, 0.70070,
		0.25817, 3.17416,
		0.07447, -0.08116, -0.03029, -0.02795,
		0.00816, 0.01023,
		0.00685, -0.01075,
		-0.34268, 0.03680, -0.05488, -0.07430,
		-0.00041, -0.02968,
		3.13228, -0.83209, 1.95765, 3.78394,
		-2.26196, 1.38520,
		-0.00401, -0.01397,
		1.01604, -0.99485, 0.62465, 0.22431,
		-0.05076, 0.12025,
		4.35229, -5.04483, 14.87533, 9.00826,
		-10.37595, 19.26596,
		0.40352, 0.19895, 0.09463, -0.10774,
		-0.17809, -0.08979, -0.00796, -0.04313,
		0.01520, -0.03538,
		1.53301, -1.75553, 4.87236, 3.23662,
		-3.62305, 6.42351,
		-0.00439, -0.01305,
		0.17194, -0.64003, 0.26609, 0.06600,
		0.01767, -0.00251,
		-0.08871, -0.15523, 0.01201, -0.03408,
		-0.29126, -0.07093, -0.00998, -0.07876,
		1.05932, -25.38650,
		-0.29354, 0.04179, -0.01726, 0.07473,
		-0.07607, -0.08859, 0.00842, -0.02359,
		0.47858, -0.39809, 1.25061, 0.87017,
		-0.82453, 1.56864,
		-0.00463, 0.02385,
		-0.29070, 8.56535,
		-0.12495, 0.06580, -0.03395, -0.02465,
		-1.06759, 0.47004, -0.40281, -0.23957,
		0.03572, -0.07012,
		0.00571, -0.00731,
		0.18601, -1.34068,
		0.03798, -0.00532, 0.00448, -0.01147,
		1.41208, -0.00668, 0.25883, 1.23788,
		-0.57774, 0.09166,
		-2.49664, -0.25235, -0.53582, -0.80126,
		0.10827, -0.08861,
		-0.03577, 0.06825,
		-0.00143, 0.04633,
		0.01586, -0.01056,
		-0.02106, 0.03804,
		-0.00088, -0.03458,
		-0.00033, -0.01079,
		0.05821, -0.02445,
		0.00602, 0.00721,
		-0.00315, -0.01021,
		-0.65454, 1.08478, -0.44593, -0.21492,
		-1.35004, 4.47299, -4.19170, 3.51236,
		1946.04629, 13960.88247, 576.24572, 8023.81797,
		2402.48512, -753.87007, -6376.99217, -10278.88014,
		-25743.89874, 15506.87748, 15609.59853, 35173.63133,
		-3.70370, 6.29538, -4.84183, -0.76942,
		-0.02465, -0.03840,
		0.00565, -0.06071,
		0.01174, 0.00253,
		-0.00230, 0.05252,
		-0.02813, 0.01359,
		0.23208, 0.03393, 0.01734, 0.04838,
		-0.46340, -0.18941, 0.25428, -0.56925,
		0.05213, 0.24704, 0.12922, -0.01531,
		0.06885, -0.08510, 0.01853, -0.00390,
		0.01196, -0.30530, 0.13117, -0.03533,
		1.79597, -0.42743, 0.98545, 2.13503,
		-1.32942, 0.68005,
		-0.01226, 0.00571,
		0.31081, 0.34932, 0.34531, -0.32947,
		-0.00548, 0.00186, -0.00157, -0.00065,
		0.30877, -0.03864, 0.04921, 0.06693,
		0.01761, -0.04119,
		1.28318, 0.38546, 0.06462, 1.18337,
		-0.48698, 0.07086,
		0.26031, -0.22813, 0.10272, 0.04737,
		-0.04506, -0.38581, -0.16624, -0.04588,
		0.00992, 0.00722,
		-0.21041, 0.20560, -0.09267, -0.03438,
		0.32264, -0.07383,
		0.09553, -0.38730, 0.17109, -0.01342,
		-0.02336, -0.01286,
		0.00230, 0.04626,
		0.01176, 0.01868,
		-0.15411, -0.32799, 0.22083, -0.14077,
		1.98392, 1.68058,
		-0.02526, -0.13164, -0.04447, -0.00153,
		0.01277, 0.00553,
		-0.26035, -0.11362, 0.14672, -0.32242,
		0.16686, -0.69957, 0.40091, -0.06721,
		0.00837, 0.09635,
		-0.08545, 0.25178, -0.22486, 16.03256,
		0.34130, -0.06313, 0.01469, -0.09012,
		-0.00744, -0.02510,
		-0.08492, -0.13733,
		-0.07620, -0.15329, 0.13716, -0.03769,
		2.01176, -1.35991, -1.04319, -2.97226,
		-0.01433, 0.61219,
		-0.55522, 0.38579, 0.31831, 0.81843,
		-0.04583, -0.14585,
		-0.10218, 0.16039, -0.06552, -0.01802,
		0.06480, -0.06641, 0.01672, -0.00287,
		0.00308, 0.09982, -0.05679, -0.00249,
		-0.36034, 0.52385, -0.29759, 0.59539,
		-3.59641, -1.02499,
		-547.53774, 734.11470, 441.86760, -626.68255,
		-2255.81376, -1309.01028, -2025.69590, 2774.69901,
		1711.21478, 1509.99797,
		-0.99274, 0.61858, -0.47634, -0.33034,
		0.00261, 0.01183,
		-0.00038, 0.11687,
		0.00994, -0.01122,
		0.03482, -0.01942,
		-0.11557, 0.38237, -0.17826, 0.00830,
		0.01193, -0.05469,
		0.01557, 0.01747,
		0.02730, -0.01182,
		-0.11284, 0.12939, -0.05621, -0.01615,
		0.04258, 0.01058,
		-0.01723, 0.00963,
		0.20666, 0.11742,
		0.07830, -0.02922,
		-0.10659, -0.05407, 0.07254, -0.13005,
		-0.02365, 0.24583, 0.31915, 1.27060,
		0.00009, -0.21541,
		-0.55324, -0.45999, -1.45885, 0.86530,
		0.85932, 1.92999,
		-0.00755, -0.00715,
		-0.02004, -0.00788,
		0.01539, 0.00837,
		0.27652, -0.50297, -0.26703, -0.28159,
		0.03950, 0.07182,
		-0.07177, 0.14140, 0.07693, 0.07564,
		-0.01316, -0.01259,
		0.01529, 0.07773,
		-90.74225, -378.15784, -510.30190, -52.35396,
		-89.15267, 415.56828, 181.52119, 54.01570,
		-0.01093, -0.05931,
		-0.01344, -0.02390,
		0.01432, -0.02470,
		-0.01509, -0.01346,
		0.03352, 0.02248,
		0.02588, -0.00948,
		0.03610, 0.17238,
		0.02909, -0.04065,
		0.00155, -0.07025,
		-0.09508, 0.14487, 0.12441, 0.16451,
		0.00001, -0.00005,
		-0.00982, -0.01895,
		-0.16968, 0.36565, 0.20234, 0.17789,
		-0.04519, -0.00588,
		0.01268, 0.00107,
		-56.32137, -58.22145, -80.55270, 28.14532,
		11.43301, 52.05752, 17.79480, -2.61997,
		-0.00005, -0.02629,
		0.01080, -0.00390,
		0.00744, 0.03132,
		0.01156, -0.01621,
		0.02162, 0.02552,
		0.00075, -0.02497,
		0.02495, 0.00830,
		0.03230, 0.00103,
		-14.84965, -4.50200, -9.73043, 9.40426,
		4.08054, 5.38571, 1.53731, -1.01288,
		0.21076, 1.74227, 0.79760, 0.39583,
		0.09879, -0.16736,
		-0.00723, -0.01536
	],
	lat_tbl: [
		-364.49380, -47.17612, -554.97858, -430.63121,
		596.44312,
		-3.94434, -7.43169, -0.06665, -2.23987,
		0.10366, -0.05567,
		-0.01463, 0.01908,
		-0.02611, -0.00350, -0.01057, -0.00610,
		-0.00015, 0.00002,
		0.00010, 0.00033, 0.00007, -0.00000,
		-0.00010, -0.00004,
		0.00012, 0.00002,
		-0.00014, -0.00048, -0.00003, -0.00007,
		0.00008, -0.00005,
		-0.00043, -0.00003, -0.00010, -0.00004,
		0.00001, 0.00001,
		-0.00003, -0.00003,
		0.00004, 0.00007,
		-0.00041, 0.00031,
		0.00076, 0.00062,
		0.00001, -0.00002,
		0.00035, 0.00053, 0.00026, 0.00019,
		0.00020, 0.00010,
		0.02936, 0.09624, -0.01153, 0.01386,
		0.00551, -0.00690, 0.00196, 0.00148,
		-0.00408, -0.00673, -0.00067, -0.00152,
		-0.00014, -0.00005,
		0.00000, 0.00005,
		-0.00116, 0.00276, -0.00391, 0.00983,
		-0.01327, -0.01986,
		-0.00003, 0.00001,
		0.01104, 0.00631, -0.01364, 0.01152,
		-0.00439, 0.01103, -0.00546, 0.00181,
		-0.00039, -0.00083,
		0.00007, 0.00002,
		-0.00010, -0.00008,
		0.00005, 0.00002,
		-0.00584, 0.00512, -0.00722, -0.00174,
		0.00101, -0.00316,
		-0.02229, -0.02797, -0.10718, 0.05741,
		0.11403, 0.10033,
		0.00036, -0.00022,
		0.00787, 0.01191, 0.01756, -0.02121,
		-0.00169, -0.00364, 0.00070, -0.00051,
		0.01850, -0.06836, 0.21471, 0.00162,
		-0.29165, 0.16799,
		-0.00002, 0.00011,
		-0.00075, -0.00077,
		-0.00675, -0.00814, 0.00029, -0.00599,
		0.00107, 0.00013,
		0.00010, -0.00002,
		0.00005, 0.00020,
		0.00355, 0.00306,
		-0.00013, -0.00061,
		-0.02950, -0.00847, 0.01037, -0.04783,
		0.04237, 0.11662,
		-0.00331, 0.00207, -0.00107, -0.00264,
		0.00072, -0.00023,
		-0.00151, 0.00146,
		-0.12847, 0.02294, 0.03611, 0.19705,
		0.16855, -0.28279,
		-0.00000, -0.00002,
		-0.00525, -0.03619, 0.05048, -0.00481,
		-0.00745, 0.04618,
		0.00286, 0.00443, 0.00521, -0.00351,
		0.00200, 0.00474, -0.00149, 0.00031,
		-0.00003, 0.00029,
		0.00686, 0.02467, 0.04275, -0.02223,
		0.02282, -0.04228, 0.03312, 0.01847,
		-0.01253, 0.01601,
		0.00076, 0.00091,
		0.00045, 0.00035,
		0.00658, 0.01586, -0.00310, 0.00628,
		-0.00045, 0.00316,
		-0.01602, -0.00340, -0.01744, 0.04907,
		0.06426, 0.02275,
		-0.00217, -0.00377, -0.00091, 0.00037,
		0.00040, -0.00003,
		-0.00017, -0.00027,
		0.00366, 0.02693, -0.00934, 0.00386,
		0.00616, -0.00037,
		0.02028, 0.02120, -0.01768, 0.02421,
		0.00102, 0.00877,
		0.00012, 0.00030,
		-0.00019, -0.02165, 0.01245, -0.00742,
		0.00172, 0.00320,
		-0.17117, -0.12908, -0.43134, 0.15617,
		0.21216, 0.56432,
		0.01139, -0.00937, -0.00058, -0.00337,
		-0.00999, 0.01862, -0.00621, -0.00080,
		-0.00025, -0.00140,
		0.09250, 0.01173, -0.03549, 0.14651,
		-0.01784, 0.00945,
		0.00000, -0.00006,
		-0.00500, 0.00086, 0.01079, -0.00002,
		-0.00012, -0.00029,
		-0.02661, 0.00140, -0.00524, -0.00460,
		-0.00352, -0.00563, -0.00277, -0.00052,
		-0.10171, -0.02001,
		0.00045, 0.00265, -0.00082, 0.00160,
		-0.00302, -0.00434, -0.00022, -0.00134,
		0.03285, 0.02964, -0.05612, -0.00668,
		-0.01821, 0.06590,
		0.00039, 0.00061,
		-0.13531, -0.03831,
		0.02553, 0.02130, -0.00336, 0.00468,
		-0.04522, -0.05540, 0.00129, -0.01767,
		0.00181, 0.00031,
		-0.00011, -0.00034,
		-0.00146, 0.01101,
		-0.00030, 0.00240, -0.00039, 0.00072,
		-0.01954, -0.03822, 0.09682, -0.04541,
		-0.01567, 0.09617,
		-0.03371, 0.33028, -0.12102, 0.05874,
		-0.00990, -0.02236,
		0.00109, 0.00158,
		-0.00482, 0.00019,
		-0.00036, 0.00004,
		0.00024, 0.00201,
		0.00017, 0.00011,
		-0.00012, 0.00002,
		-0.00323, -0.01062,
		-0.00130, 0.00091,
		0.00056, -0.00017,
		0.00774, 0.00601, 0.02550, 0.01700,
		-0.84327, 0.77533, -0.71414, -0.50643,
		-473.30877, -1504.79179, -458.52274, -865.82237,
		-417.34994, -681.03976, 765.50697, -1653.67165,
		4427.33176, 710.53895, -5016.39367, 4280.60361,
		0.33957, 0.38390, -0.38631, 0.81193,
		0.00154, -0.00043,
		0.01103, -0.00017,
		-0.00046, 0.00221,
		0.00059, 0.00014,
		0.00160, 0.00475,
		0.06191, -0.13289, 0.02884, -0.00566,
		-0.01572, 0.23780, -0.05140, -0.03228,
		-0.00716, -0.00978, -0.01048, 0.01317,
		-0.01267, -0.01198, 0.00037, -0.00330,
		-0.02305, 0.00355, -0.00121, -0.00496,
		-0.04369, -0.01343, 0.05347, -0.12433,
		0.02090, 0.17683,
		0.00028, -0.00490,
		-0.02778, -0.05587, -0.01658, 0.05655,
		0.00204, -0.00092, 0.00020, 0.00014,
		-0.00603, -0.03829, 0.00778, -0.00588,
		-0.00266, 0.00097,
		-0.02158, -0.07742, 0.09306, -0.01827,
		-0.01048, 0.07885,
		-0.02485, -0.02505, 0.00471, -0.01026,
		0.06663, 0.01110, 0.00469, -0.05347,
		-0.00016, -0.00013,
		0.02622, 0.02273, -0.01009, 0.01391,
		-0.01042, -0.00444,
		-0.04293, -0.00767, -0.00154, -0.01739,
		0.00353, -0.00763,
		-0.00060, 0.00010,
		-0.00053, -0.00146,
		-0.05317, 0.05760, -0.01801, -0.02099,
		-0.02611, -0.01836,
		-0.00256, 0.00812, -0.00145, 0.00054,
		-0.00008, 0.00015,
		-0.04087, 0.08860, -0.05385, -0.02134,
		0.02771, 0.02441, -0.00234, 0.01571,
		-0.00260, 0.00097,
		0.10151, 0.49378, -0.28555, 0.11428,
		-0.00286, 0.01224, 0.00160, 0.00069,
		0.00000, -0.00040,
		-0.13286, 0.00448,
		0.01225, -0.00568, 0.00341, 0.00224,
		-0.23483, -0.07859, 0.30733, -0.21548,
		-0.02608, 0.00756,
		0.09789, 0.02878, -0.11968, 0.08981,
		0.02046, -0.00888,
		0.02955, 0.01486, -0.00981, 0.01542,
		-0.01674, -0.01540, 0.00019, -0.00449,
		-0.02140, 0.00638, 0.00112, -0.00730,
		-0.08571, 0.13811, -0.16951, -0.02917,
		-0.03931, -0.32643,
		-68.64541, -81.00521, -47.97737, 15.75290,
		181.76392, -36.00647, -48.32098, -259.02226,
		-265.57466, 554.05904,
		0.09017, 0.18803, -0.12459, 0.10852,
		0.00211, 0.00002,
		0.00304, -0.00370,
		0.00174, 0.00279,
		0.00139, 0.00095,
		0.04881, 0.00262, -0.01020, 0.03762,
		0.00987, 0.00612,
		0.00054, -0.00036,
		0.00009, -0.00094,
		0.02279, 0.01785, -0.00778, 0.01263,
		0.00040, -0.00112,
		-0.00452, -0.00662,
		0.00483, -0.00030,
		-0.00054, -0.00205,
		-0.00052, -0.00362, -0.00215, -0.00247,
		0.02893, -0.01965, -0.00004, 0.04114,
		-0.00284, -0.00103,
		0.01827, -0.07822, 0.18010, 0.04805,
		-0.21702, 0.18808,
		0.00095, -0.00132,
		-0.01488, 0.00746,
		0.00198, 0.00190,
		0.01032, 0.03392, 0.04318, -0.07332,
		-0.01004, 0.00787,
		-0.00308, -0.01177, -0.01431, 0.02659,
		0.00273, -0.00374,
		-0.02545, 0.00644,
		28.68376, 13.74978, 29.60401, -47.98255,
		-65.91944, -18.48404, -1.73580, 64.67487,
		-0.02492, 0.00104,
		-0.00829, -0.00134,
		0.00077, 0.00005,
		-0.00513, 0.00403,
		0.00071, -0.00047,
		-0.00023, -0.00063,
		0.00120, 0.00370,
		-0.00038, -0.00037,
		0.00080, -0.00018,
		0.00866, 0.00156, -0.01064, 0.02131,
		0.00000, -0.00001,
		0.00038, -0.00068,
		-0.00909, -0.02187, -0.02599, 0.05507,
		-0.00022, -0.01468,
		0.00032, 0.00500,
		9.86233, -2.85314, -2.25791, -13.83444,
		-12.38794, 3.79861, 2.76343, 6.63505,
		0.00066, 0.00007,
		-0.00016, -0.00039,
		0.00014, 0.00059,
		-0.00031, -0.00024,
		-0.00168, 0.00259,
		0.00007, -0.00005,
		-0.00052, 0.00558,
		0.00110, 0.01037,
		1.59224, -2.37284, -2.00023, -2.28280,
		-1.49571, 1.48293, 0.60041, 0.56376,
		-0.54386, 0.03568, -0.10392, 0.31005,
		0.09104, 0.03015,
		0.00826, -0.00524
	],
	rad_tbl: [
		-816.07287, -381.41365, -33.69436, 177.22955,
		0.18630,
		-8.29605, -11.15519, -0.57407, -3.53642,
		0.16663, -0.06334,
		-0.03056, 0.02767,
		-0.04161, 0.03917, -0.02425, 0.00204,
		-0.00034, 0.00023,
		0.00058, -0.00111, 0.00039, -0.00015,
		0.00006, -0.00023,
		0.00237, 0.00191,
		0.00154, -0.00029, 0.00009, 0.00011,
		-0.00041, 0.00037,
		-0.00010, -0.00064, 0.00015, -0.00005,
		0.00012, -0.00003,
		-0.00034, 0.00026,
		0.00011, -0.00007,
		-0.00158, 0.00087,
		0.00278, 0.00137,
		0.00024, -0.00020,
		0.00530, -0.00448, 0.00780, 0.00408,
		0.00062, 0.00035,
		-1.35261, 0.79891, -0.81597, -0.43774,
		0.14713, -0.27415, 0.05298, 0.02230,
		-0.02089, -0.01070, -0.00374, 0.00342,
		-0.00142, 0.00270,
		-0.00039, 0.00063,
		0.16024, 0.27088, -0.32127, 0.27467,
		-0.16615, -0.24460,
		-0.00073, 0.00032,
		-0.05710, -0.05265, -0.06025, 0.05120,
		-0.05295, 0.23477, -0.08211, 0.04575,
		-0.00769, -0.01067,
		-0.00570, 0.00015,
		-0.00251, -0.00140,
		-0.00131, -0.00018,
		-0.12246, 0.15836, -0.13065, -0.03222,
		0.00795, -0.04232,
		-0.36585, -0.31154, 0.68504, -0.96006,
		1.19304, 0.88631,
		0.00132, 0.00046,
		0.13105, 0.04252, 0.05164, -0.06837,
		-0.01351, -0.01458, 0.00376, -0.00557,
		0.28532, -0.17290, -0.53946, -0.79365,
		-0.95246, 0.74984,
		0.00019, 0.00132,
		-0.00163, -0.00295,
		-0.40106, -0.26573, -0.00155, -0.22655,
		0.04349, -0.00376,
		0.00149, -0.00001,
		0.00523, 0.00078,
		0.01203, 0.00558,
		-0.00708, 0.00520,
		-0.36428, -1.28827, 1.50845, -0.83063,
		0.58802, 0.89998,
		-0.55256, 0.01255, -0.15169, -0.26715,
		0.06061, -0.04122,
		-0.00397, 0.00534,
		-0.52576, 1.22031, 1.44098, 0.92406,
		0.67214, -0.85486,
		-0.00010, 0.00001,
		0.28820, -0.84198, 0.78291, 0.00251,
		0.02398, 0.32093,
		-0.02331, 0.10109, -0.07555, 0.03557,
		-0.61580, 0.43399, -0.43779, -0.26390,
		0.06885, -0.13803,
		0.17694, 0.19245, 0.15119, -0.05100,
		0.49469, -0.45028, 0.33590, 0.15677,
		-0.04702, 0.10265,
		-0.00942, -0.00580,
		-0.00555, -0.00252,
		-0.32933, 0.92539, -0.91004, -0.04490,
		-0.01812, -0.37121,
		0.34695, 0.50855, -0.24721, 0.86063,
		-0.84747, 0.01983,
		0.01948, 0.02039, 0.00748, -0.00727,
		-0.00271, 0.00220,
		0.00309, 0.00196,
		0.02030, 0.17201, -0.03716, 0.02801,
		0.01871, 0.00002,
		0.31736, 1.17319, -1.42245, 0.73416,
		-0.52302, -0.85056,
		0.00522, -0.00126,
		0.33571, 0.34594, -0.07709, 0.21114,
		-0.04066, -0.01742,
		1.72228, 1.46934, -3.06437, 5.06723,
		-6.53800, -3.55839,
		-0.06933, 0.13815, 0.03684, 0.03284,
		-0.04841, 0.09571, -0.02350, 0.00418,
		0.01302, 0.00579,
		0.73408, 0.64718, -1.37437, 2.04816,
		-2.70756, -1.52808,
		0.00523, -0.00166,
		0.25915, 0.06900, -0.02758, 0.10707,
		0.00062, 0.00744,
		-0.08117, 0.04840, -0.01806, -0.00637,
		0.03034, -0.12414, 0.03419, -0.00388,
		10.92603, 0.48169,
		-0.01753, -0.12853, -0.03207, -0.00801,
		0.03904, -0.03326, 0.01033, 0.00366,
		0.17249, 0.20846, -0.38157, 0.54639,
		-0.68518, -0.36121,
		-0.01043, -0.00186,
		-3.33843, -0.16353,
		0.03462, 0.06669, -0.01305, 0.01803,
		-0.22703, -0.52219, 0.11709, -0.19628,
		0.03410, 0.01741,
		0.00338, 0.00265,
		0.63213, 0.08944,
		0.00236, 0.01829, 0.00546, 0.00218,
		0.00073, -0.72570, 0.63698, -0.13340,
		0.04698, 0.29716,
		-0.13126, 1.27705, -0.40980, 0.27400,
		-0.04525, -0.05529,
		-0.03249, -0.01696,
		-0.02314, -0.00076,
		0.00510, 0.00764,
		-0.01847, -0.01021,
		0.01688, -0.00044,
		0.00531, -0.00016,
		-0.01219, -0.02903,
		-0.00361, 0.00299,
		0.00504, -0.00153,
		-0.53625, -0.32460, 0.10642, -0.22070,
		-2.21651, -0.66036, -1.74652, -2.08198,
		-6810.78679, 967.02869, -3915.97140, 291.65905,
		372.99563, 1196.01966, 5108.01033, -3172.64698,
		-7685.78246, -12789.43898, -17474.50562, 7757.84703,
		3.13224, 1.84743, -0.38257, 2.40590,
		0.01860, -0.01217,
		0.03004, 0.00278,
		-0.00125, 0.00579,
		-0.02673, -0.00112,
		0.00662, 0.01374,
		-0.02729, 0.13109, -0.02836, 0.00877,
		0.12171, -0.27475, 0.34765, 0.15882,
		-0.12548, 0.02603, 0.00710, 0.06538,
		-0.04039, -0.03257, -0.00186, -0.00880,
		0.16643, 0.00707, 0.01918, 0.07156,
		-0.20459, -0.85107, 1.01832, -0.47158,
		0.32582, 0.63002,
		-0.00282, -0.00711,
		-0.19695, 0.15053, 0.15676, 0.17847,
		0.00071, 0.00286, -0.00039, 0.00083,
		0.02009, 0.17859, -0.03894, 0.02805,
		0.02379, 0.00752,
		0.17529, -0.57783, 0.53257, -0.02829,
		0.03211, 0.21777,
		0.13813, 0.16305, -0.02996, 0.06303,
		0.21058, -0.02659, 0.02596, -0.08808,
		-0.00389, 0.00586,
		0.08986, 0.09204, -0.01480, 0.04031,
		0.06115, 0.18366,
		0.25636, 0.06905, 0.00719, 0.11391,
		0.00636, -0.01113,
		-0.02808, 0.00150,
		-0.01219, 0.00832,
		0.28626, -0.09573, 0.10481, 0.16559,
		-0.94578, 1.26394,
		0.08846, -0.01623, 0.00082, -0.02640,
		-0.00347, 0.00798,
		0.12873, -0.21248, 0.27999, 0.14348,
		0.44082, 0.10453, 0.04362, 0.25332,
		-0.06077, 0.00555,
		-0.06947, -0.05511, -10.08703, -0.10614,
		0.04059, 0.21355, 0.05632, 0.00871,
		0.01599, -0.00531,
		0.36835, -0.03530,
		0.09519, -0.04961, 0.02568, 0.08613,
		0.57033, 0.84599, 1.27123, -0.41266,
		-0.36937, -0.00655,
		-0.16547, -0.24000, -0.35213, 0.13345,
		0.05870, -0.01524,
		0.06419, 0.04136, -0.00681, 0.02606,
		-0.02519, -0.02732, -0.00105, -0.00677,
		-0.03891, 0.00106, 0.00087, -0.02256,
		-0.20834, -0.14624, -0.23178, -0.11786,
		0.32479, -1.41222,
		-303.74549, -202.79324, 260.20290, 184.84320,
		536.68016, -881.56427, -1125.64824, -791.09928,
		-596.61162, 659.35664,
		0.24561, 0.39519, -0.12601, 0.18709,
		-0.00700, 0.00136,
		0.30750, 0.00009,
		0.00443, 0.00384,
		0.01170, 0.02078,
		0.15043, 0.04802, 0.00386, 0.06942,
		0.02107, 0.00495,
		-0.01067, 0.00951,
		0.00937, 0.01996,
		0.04922, 0.04337, -0.00583, 0.02110,
		-0.00691, 0.02793,
		-0.00364, -0.00682,
		-0.09143, 0.15369,
		0.02043, 0.05451,
		0.04053, -0.08179, 0.09645, 0.05330,
		-0.10149, -0.01594, -0.96773, 0.13660,
		0.17326, 0.00013,
		0.20990, -0.23184, -0.38407, -0.64733,
		-0.84754, 0.38889,
		0.00310, -0.00340,
		0.00970, -0.00788,
		-0.01111, 0.00677,
		0.18147, 0.09968, 0.10170, -0.09233,
		-0.03165, 0.01790,
		-0.04727, -0.02364, -0.02546, 0.02451,
		0.00442, -0.00426,
		-0.02540, 0.00471,
		130.42585, -31.30051, 17.99957, -174.75585,
		-142.96798, -27.89752, -19.42122, 59.14872,
		-0.01899, 0.00388,
		-0.01265, 0.00694,
		0.01966, 0.01140,
		-0.00439, 0.00503,
		-0.01867, 0.02826,
		0.00752, 0.02012,
		-0.14734, 0.01909,
		0.03312, 0.02327,
		0.05843, 0.00061,
		-0.06958, -0.05798, -0.09174, 0.06242,
		0.00003, 0.00001,
		0.00670, -0.00305,
		-0.13637, -0.06058, -0.06372, 0.07257,
		0.00209, -0.01369,
		-0.00044, 0.00355,
		17.90079, -17.48270, -8.77915, -24.54483,
		-15.67123, 3.62668, 0.52038, 5.13220,
		0.02574, 0.00003,
		0.00339, 0.00919,
		-0.02778, 0.00464,
		0.01429, 0.01003,
		-0.01661, 0.01327,
		0.02216, 0.00034,
		-0.00389, 0.01076,
		-0.00035, 0.00983,
		1.23731, -4.18017, -2.61932, -2.66346,
		-1.45540, 1.10310, 0.23322, 0.40775,
		-0.43623, 0.06212, -0.09900, 0.19456,
		0.03639, 0.02566,
		0.00309, -0.00116
	],
	arg_tbl: [
		0, 4,
		3, 4, 3, -8, 4, 3, 5, 2,
		3, 5, 2, -6, 3, -4, 4, 0,
		2, 2, 5, -5, 6, 1,
		3, 12, 3, -24, 4, 9, 5, 0,
		3, 2, 2, 1, 3, -8, 4, 1,
		3, 11, 3, -21, 4, 2, 5, 0,
		3, 3, 2, -7, 3, 4, 4, 0,
		3, 7, 3, -13, 4, -1, 5, 1,
		3, 1, 3, -2, 4, 2, 6, 0,
		3, 1, 2, -8, 3, 12, 4, 1,
		3, 1, 4, -8, 5, 4, 6, 0,
		3, 1, 4, -7, 5, 2, 6, 0,
		3, 1, 4, -9, 5, 7, 6, 0,
		1, 1, 7, 0,
		2, 1, 5, -2, 6, 0,
		3, 1, 3, -2, 4, 1, 5, 0,
		3, 3, 3, -6, 4, 2, 5, 1,
		3, 12, 3, -23, 4, 3, 5, 0,
		2, 8, 3, -15, 4, 3,
		2, 1, 4, -6, 5, 2,
		3, 2, 2, -7, 3, 7, 4, 0,
		2, 1, 2, -3, 4, 2,
		2, 2, 5, -4, 6, 0,
		1, 1, 6, 1,
		2, 9, 3, -17, 4, 2,
		3, 2, 3, -4, 4, 2, 5, 0,
		3, 2, 3, -4, 4, 1, 5, 0,
		2, 1, 5, -1, 6, 0,
		2, 2, 2, -6, 4, 2,
		2, 1, 3, -2, 4, 2,
		2, 2, 5, -3, 6, 0,
		1, 2, 6, 1,
		2, 3, 5, -5, 6, 1,
		1, 1, 5, 2,
		3, 4, 3, -8, 4, 2, 5, 0,
		2, 1, 5, -5, 6, 0,
		2, 7, 3, -13, 4, 2,
		2, 3, 2, -9, 4, 0,
		2, 2, 5, -2, 6, 0,
		1, 3, 6, 0,
		2, 1, 4, -5, 5, 0,
		2, 2, 3, -4, 4, 2,
		2, 6, 3, -11, 4, 2,
		2, 4, 5, -5, 6, 0,
		1, 2, 5, 2,
		3, 1, 4, -3, 5, -3, 6, 0,
		2, 3, 3, -6, 4, 2,
		2, 1, 4, -4, 5, 1,
		2, 5, 3, -9, 4, 2,
		1, 3, 5, 1,
		2, 4, 3, -8, 4, 2,
		3, 1, 4, -4, 5, 2, 6, 0,
		3, 1, 4, -1, 5, -5, 6, 0,
		2, 4, 3, -7, 4, 2,
		2, 1, 4, -3, 5, 2,
		3, 1, 4, -5, 5, 5, 6, 1,
		3, 1, 4, -4, 5, 3, 6, 0,
		3, 1, 4, -3, 5, 1, 6, 0,
		2, 5, 3, -10, 4, 1,
		1, 4, 5, 0,
		2, 3, 3, -5, 4, 2,
		3, 1, 4, -3, 5, 2, 6, 0,
		2, 1, 4, -5, 6, 2,
		2, 1, 4, -2, 5, 2,
		3, 1, 4, -4, 5, 5, 6, 1,
		2, 6, 3, -12, 4, 1,
		2, 1, 4, -4, 6, 0,
		2, 2, 3, -3, 4, 2,
		2, 10, 3, -18, 4, 0,
		2, 1, 4, -3, 6, 1,
		3, 1, 4, -2, 5, 2, 6, 0,
		2, 7, 3, -14, 4, 1,
		3, 1, 4, 1, 5, -5, 6, 1,
		2, 1, 4, -1, 5, 0,
		3, 1, 4, -3, 5, 5, 6, 1,
		3, 1, 4, 2, 5, -7, 6, 1,
		2, 1, 4, -2, 6, 2,
		3, 1, 4, -2, 5, 3, 6, 0,
		2, 1, 3, -1, 4, 0,
		2, 2, 2, -7, 4, 1,
		2, 9, 3, -16, 4, 2,
		2, 1, 4, -3, 7, 0,
		2, 1, 4, -1, 6, 0,
		3, 1, 4, -2, 5, 4, 6, 1,
		2, 1, 2, -4, 4, 2,
		2, 8, 3, -16, 4, 2,
		2, 1, 4, -2, 7, 0,
		3, 3, 3, -5, 4, 2, 5, 0,
		3, 1, 4, 1, 5, -3, 6, 0,
		2, 1, 4, -2, 8, 0,
		2, 1, 4, -1, 7, 0,
		2, 1, 4, -1, 8, 0,
		3, 3, 2, -7, 3, 3, 4, 0,
		3, 2, 2, 1, 3, -7, 4, 0,
		3, 1, 4, 1, 6, -3, 7, 0,
		3, 1, 4, 2, 5, -5, 6, 1,
		3, 4, 3, -7, 4, 3, 5, 1,
		1, 1, 4, 5,
		3, 4, 3, -9, 4, 3, 5, 1,
		3, 1, 4, -2, 5, 5, 6, 0,
		3, 3, 2, -7, 3, 5, 4, 0,
		3, 1, 3, -1, 4, 2, 6, 0,
		3, 1, 4, 1, 5, -2, 6, 0,
		3, 3, 3, -7, 4, 2, 5, 0,
		2, 8, 3, -14, 4, 1,
		2, 1, 2, -2, 4, 1,
		2, 1, 4, 1, 6, 1,
		2, 9, 3, -18, 4, 1,
		2, 2, 2, -5, 4, 1,
		2, 1, 3, -3, 4, 2,
		2, 1, 4, 2, 6, 0,
		2, 1, 4, 1, 5, 1,
		3, 4, 3, -9, 4, 2, 5, 1,
		2, 7, 3, -12, 4, 1,
		2, 2, 4, -5, 5, 0,
		2, 2, 3, -5, 4, 2,
		2, 6, 3, -10, 4, 1,
		2, 1, 4, 2, 5, 1,
		3, 2, 4, -5, 5, 2, 6, 0,
		2, 3, 3, -7, 4, 1,
		2, 2, 4, -4, 5, 0,
		2, 5, 3, -8, 4, 1,
		2, 1, 4, 3, 5, 0,
		3, 2, 4, -4, 5, 2, 6, 0,
		3, 2, 4, -1, 5, -5, 6, 0,
		2, 4, 3, -6, 4, 1,
		2, 2, 4, -3, 5, 0,
		3, 2, 4, -5, 5, 5, 6, 1,
		3, 2, 4, -4, 5, 3, 6, 0,
		2, 3, 3, -4, 4, 1,
		2, 2, 4, -5, 6, 2,
		2, 2, 4, -2, 5, 1,
		3, 2, 4, -4, 5, 5, 6, 1,
		2, 2, 4, -4, 6, 0,
		2, 2, 3, -2, 4, 0,
		2, 2, 4, -3, 6, 1,
		2, 2, 4, -1, 5, 1,
		2, 2, 4, -2, 6, 0,
		1, 1, 3, 1,
		2, 2, 4, -1, 6, 0,
		2, 1, 2, -5, 4, 1,
		2, 8, 3, -17, 4, 1,
		3, 2, 4, 2, 5, -5, 6, 1,
		3, 4, 3, -6, 4, 3, 5, 1,
		3, 10, 3, -17, 4, 3, 6, 0,
		1, 2, 4, 4,
		3, 4, 3, -10, 4, 3, 5, 1,
		2, 8, 3, -13, 4, 0,
		2, 1, 2, -1, 4, 0,
		2, 2, 4, 1, 6, 0,
		2, 2, 2, -4, 4, 0,
		2, 1, 3, -4, 4, 1,
		2, 2, 4, 1, 5, 0,
		2, 7, 3, -11, 4, 0,
		2, 3, 4, -5, 5, 0,
		2, 2, 3, -6, 4, 1,
		2, 6, 3, -9, 4, 0,
		2, 2, 4, 2, 5, 0,
		2, 3, 4, -4, 5, 0,
		2, 5, 3, -7, 4, 0,
		2, 4, 3, -5, 4, 1,
		2, 3, 4, -3, 5, 1,
		2, 3, 3, -3, 4, 0,
		2, 3, 4, -2, 5, 2,
		3, 3, 4, -4, 5, 5, 6, 0,
		2, 2, 3, -1, 4, 0,
		2, 3, 4, -3, 6, 0,
		2, 3, 4, -1, 5, 1,
		2, 3, 4, -2, 6, 0,
		2, 1, 3, 1, 4, 1,
		2, 3, 4, -1, 6, 0,
		3, 4, 3, -5, 4, 3, 5, 0,
		1, 3, 4, 3,
		3, 4, 3, -11, 4, 3, 5, 0,
		1, 1, 2, 0,
		2, 2, 2, -3, 4, 0,
		2, 1, 3, -5, 4, 0,
		2, 4, 4, -5, 5, 0,
		2, 6, 3, -8, 4, 0,
		2, 4, 4, -4, 5, 0,
		2, 5, 3, -6, 4, 0,
		2, 4, 3, -4, 4, 0,
		2, 4, 4, -3, 5, 1,
		3, 6, 3, -8, 4, 2, 5, 0,
		2, 3, 3, -2, 4, 0,
		2, 4, 4, -2, 5, 1,
		2, 4, 4, -1, 5, 0,
		2, 1, 3, 2, 4, 0,
		1, 4, 4, 3,
		2, 2, 2, -2, 4, 0,
		2, 7, 3, -9, 4, 0,
		2, 5, 4, -5, 5, 0,
		2, 6, 3, -7, 4, 0,
		2, 5, 4, -4, 5, 0,
		2, 5, 3, -5, 4, 0,
		2, 5, 4, -3, 5, 0,
		2, 5, 4, -2, 5, 0,
		1, 5, 4, 3,
		1, 6, 4, 2,
		1, 7, 4, 0,
		-1
	]
};

// jupiter.js
$ns.jupiter = {
	maxargs: 9,
	max_harmonic: [0, 0, 1, 0, 9, 16, 7, 5, 0],
	max_power_of_t: 6,
	distance: 5.2026032092000003e+00,
	timescale: 3652500.0,
	trunclvl: 1.0,
	lon_tbl: [
		153429.13855, 130818.16897, 18120.42948, -8463.12663,
		-5058.91447, 1092566021.02148, 123671.25097,
		-5.43364, 12.06012,
		30428.31077, -74667.61443, 46848.16236, -66373.44474,
		24312.54264, -26045.64766, 18353.92564, -4022.13679,
		4037.97936, 10059.82468, -4622.55896, 1383.21617,
		-187.25468, -1171.66028,
		-0.00062, -0.21713,
		-1198.83945, 1178.62445, -1492.07393, 153.07155,
		-245.57966, -391.94010, 82.26400, -40.92104,
		3.72520, 10.57242,
		-0.04720, -0.04448, -0.04329, -0.06043,
		-0.03905, 0.15712,
		-0.05644, -0.00129,
		-0.00342, 0.02473,
		0.00434, -0.01862,
		0.00431, -0.03993,
		-0.03159, -0.15982,
		-0.09928, 0.04430, -0.00357, 0.31312,
		-0.01346, -0.00180,
		-0.09107, 0.01215,
		0.02485, 0.01024,
		27.29869, 2.70896, 12.91956, 19.21726,
		-6.91384, 5.12954, -1.07533, -1.71691,
		-0.01423, 0.03121,
		-32.48652, -26.13483, 46.78162, -62.02701,
		94.96809, 81.73791, -20.13673, 131.05065,
		-0.00798, 0.01786,
		13.99591, 16.87756, -8.51726, 21.59490,
		-14.28833, -9.45530, 7.73954, -6.53078,
		0.03175, -0.04295,
		3.06742, -0.11838, 1.03630, 0.94004,
		-0.14085, 0.14434,
		-0.03363, 0.00993,
		-0.00007, -0.02748,
		26.01507, -7.37178, 16.96955, 6.24203,
		-0.40481, 3.72456, -0.53597, -0.14938,
		37.82081, 26.15887, -2.82115, 78.26478,
		-63.39155, -5.52419, 13.11482, -43.54977,
		15.64940, 6.67505,
		-10.25616, -7.39672, -12.37441, 12.24417,
		8.54922, 9.68451,
		-0.03658, -0.00963,
		1.65523, 0.43093, 0.32023, 0.71365,
		-0.12226, 0.03759,
		0.10388, 0.47212, -0.02791, 0.09929,
		-0.04116, -0.03125,
		-0.10240, -0.23199, -0.03524, -0.13625,
		7.52726, 6.86314, 0.01239, 13.46530,
		-5.22256, 1.56116, -0.15925, -1.19571,
		3.26302, 0.06097, -0.14444, -0.20301,
		1.93822, -80.12566,
		0.98665, -7.52986, 3.86703, -2.43028,
		0.64180, 0.78351,
		0.00190, -0.00633,
		-0.00321, -0.04403,
		0.19018, 0.14335, 0.10315, 0.53154,
		-0.00062, -0.00464,
		-0.00109, 0.02150,
		1.19993, 47.21638, -24.56067, 25.06332,
		-7.50751, -6.36250, 1.39443, -1.23806,
		0.04951, 0.02176,
		0.02802, -0.01665,
		-0.10698, -0.13635,
		73.54797, -52.34968, 74.98754, 86.56283,
		-69.01463, 44.56866,
		0.04387, -0.05925,
		-0.03732, -0.03264,
		0.00967, 0.02143,
		10.59429, 26.48226, 34.03470, 3.96160,
		4.15919, -20.22616, -5.25903, -3.40177,
		0.05111, -0.06788,
		0.06497, 1.21024, -0.29607, 0.49991,
		-0.06055, -0.03464,
		0.02950, 0.16429,
		0.00722, -0.90806,
		-0.02161, 0.00902,
		-0.00261, 0.00077,
		0.00434, -0.29231,
		0.00456, 0.04781,
		1.33214, -2.62015, 0.79761, -0.81850,
		0.06371, 0.00119,
		0.03049, -0.03553, 0.02373, -0.01411,
		-189.06132, -169.17940, 5.27464, -227.72664,
		83.72511, -12.04794, 0.23965, 23.75496,
		-3.43532, -0.34276,
		-1.35880, 0.45053, -0.34298, -0.11441,
		-0.16328, 0.07423,
		481.48150, 79.82461, 453.82764, 941.94205,
		-635.83924, 397.29087, -81.54066, -417.22420,
		149.91822, 10.53490,
		-0.13210, 0.36740,
		0.33777, 0.15893,
		-2562.04968, 2442.77844, -2602.66709, 2838.87348,
		723.50715, -1284.58208, -4557.23362, -4514.61100,
		-8960.81693, 4663.55087, -4947.61530, 19377.42027,
		-0.16786, -0.19514,
		0.32100, 0.91502,
		4.96600, -1.11836,
		307.38057, 175.14618, 16.02093, 444.42376,
		-219.80047, 62.39286, -18.14266, -52.23698,
		0.02111, 0.00469,
		-20.97409, -34.48296, -2.03906, -27.07560,
		3.73818, -3.00599, 0.24112, 0.41430,
		-0.03552, 0.00394,
		-0.00217, 0.02307,
		0.03686, 0.00510,
		34.46537, 10.23293, 9.99520, 28.88781,
		-11.31210, 3.52646, -0.48062, -2.93641,
		-0.00987, -0.05310,
		-38.39539, 0.04568, -31.73684, -1.83151,
		-24.97332, -1.71244, 0.33498, 7.03899,
		-4.15247, 200.43434,
		-0.00800, 0.04462,
		37.83113, -13.40661, 9.49434, -35.41588,
		-14.72767, -3.84674, -0.31412, 3.97734,
		0.02908, -0.00353,
		1.89935, -14.31774, 7.77051, -7.08945,
		1.90915, 1.78908, -0.41445, 0.30506,
		-14.43121, 7.30707, -11.97842, -17.64121,
		13.38962, -7.20982,
		-5.23362, 2.11364, -0.45605, 4.08835,
		1.42683, 0.24838,
		-0.00605, 0.03199,
		-0.17609, -1.43091, 0.32444, -0.51371,
		0.06182, 0.03733,
		0.00696, -0.13438,
		4.67581, 4.42379, -1.52602, 4.20659,
		-1.31757, -0.72910,
		1.29012, 0.97780, 2.25895, -0.85306,
		1.74120, -5.09507,
		0.28107, -0.05040, 0.05508, -0.06349,
		-0.00061, 0.48249,
		-2.37749, 1.78180, -1.67423, -0.35618,
		0.05789, -0.35287,
		0.56252, -0.66584, 0.61979, 4.84016,
		-4.64462, 17.48002,
		0.40982, -4.19214, -1.55252, -1.87505,
		-0.31070, 0.15554,
		-0.00034, 0.11102,
		0.01116, -0.04166,
		9.27689, -4.32090, 6.84888, 1.78741,
		-0.09306, 1.68391, -0.27482, -0.04197,
		-7.83068, 37.71086, -37.53346, 7.18559,
		0.74427, -24.29751, 10.87837, 1.35503,
		0.00998, -0.03395,
		-133.52206, -150.11329, 4.27494, -173.79469,
		150.87961, -356.29181, -330.17873, -426.29809,
		-607.98186, 126.35464, -299.69623, 556.41055,
		-0.00342, 0.04411,
		44.65946, 42.07312, 85.71397, 5.95130,
		24.98064, -41.20026, -14.05970, -10.46101,
		-2.24038, 2.89211,
		0.06175, 0.08128, 0.00705, 0.01939,
		-1.08361, -0.08213, -0.20868, -0.36268,
		-4.96489, -2.05966, -6.16586, 3.65514,
		-3.12555, 12.20821,
		-1.11236, -1.73772, -1.34045, -0.22774,
		-0.08639, 0.27355,
		-0.07700, 1.06260, -0.46013, 0.31916,
		-0.04969, -0.09488,
		-1.54000, 0.04949, -0.07616, -0.95933,
		0.93303, 3.43183,
		-0.82917, -0.82042, -0.68158, 0.17083,
		0.06942, 0.17491,
		-0.02699, -0.01051,
		0.00657, 0.03063,
		-0.52595, 0.84035, -0.88323, -0.70188,
		0.60928, -0.48179,
		0.38290, 0.04482, 0.26456, -0.32369,
		-0.00615, 0.03218,
		-0.32943, 0.14675, -0.10782, -0.09036,
		-0.58003, 0.72888, -0.46654, 1.17977,
		0.00222, 0.01541,
		-0.19226, -0.07770, -0.01829, -0.05070,
		-1.75385, -1.32969, 0.52361, -1.36036,
		0.67222, 1.34612,
		6.96841, -29.24025, -23.76900, -39.91647,
		-41.01215, -2.23638, -18.81024, 20.77095,
		-0.68592, -2.26212, -1.14065, -0.76493,
		-0.18044, 0.15193,
		-0.20669, -0.44387, 0.25697, -0.17880,
		-0.53097, 0.43181, -0.35187, 0.71934,
		-0.14962, 0.09220, -0.05031, -0.03924,
		0.06571, 0.29487,
		0.05170, 0.36847,
		0.02754, -0.00411,
		-0.08313, -0.16907, 0.10273, -0.07315,
		-0.02312, 0.04912,
		-0.01062, -0.02713,
		0.03806, 0.13401,
		-1.79865, -2.04540, -2.69965, -0.65706,
		-1.17916, 0.79292,
		0.02415, 0.14001,
		-0.01767, 0.04209,
		0.05212, -0.01795,
		0.01285, 0.04028,
		0.01075, 0.05533,
		0.02323, -0.00864,
		-0.04691, 0.03128,
		0.00548, 0.02254,
		0.00011, 0.12033
	],
	lat_tbl: [
		548.59659, 594.29629, 219.97664, 59.71822,
		23.62157, 40.77732, 227.07380,
		0.00293, -0.00745,
		-307.33226, -347.92807, -309.49383, -428.18929,
		-96.59506, -191.36254, 2.11014, -34.44145,
		2.23085, 6.77110, -5.43468, -0.28391,
		0.28355, -1.81690,
		0.00036, 0.00078,
		-1.83259, 1.17464, -2.66976, -0.92339,
		-0.23645, -1.20623, 0.25248, -0.04958,
		0.00064, 0.03599,
		-0.00079, 0.00004, -0.00005, -0.00010,
		-0.00024, 0.00051,
		0.00001, 0.00005,
		0.00015, 0.00010,
		0.00017, -0.00004,
		0.00113, -0.00011,
		0.00021, 0.00087,
		0.00120, -0.00114, -0.00881, -0.00020,
		-0.00005, 0.00009,
		0.00005, 0.00007,
		0.00002, -0.00033,
		-0.00554, -0.32274, 0.23695, -0.11184,
		0.04050, 0.09929, -0.02189, 0.00305,
		-0.00142, -0.00055,
		0.66623, 0.34590, 0.74913, -0.23202,
		-1.08316, -1.40407, 1.72287, -0.07604,
		0.00024, 0.00004,
		0.03592, 0.91143, -1.11848, -0.17473,
		0.91500, -1.34912, 0.85229, 0.69029,
		-0.00019, 0.00075,
		0.03615, 0.30768, -0.08733, 0.12016,
		-0.01716, -0.01138,
		0.00021, 0.00004,
		0.00531, 0.00098,
		-0.14354, -0.02364, -0.05559, -0.07561,
		0.01419, -0.01141, 0.00014, 0.00218,
		-0.36564, 0.13498, -0.13283, -0.11462,
		0.23741, 0.14960, -0.23173, 0.25148,
		0.00763, -0.05987,
		-0.00857, 0.20312, -0.29399, 0.34831,
		-1.33166, -0.46808,
		-0.00027, 0.00046,
		0.15729, 0.01367, 0.04093, 0.07447,
		-0.01598, 0.00785,
		0.00583, 0.00324, 0.00053, 0.00160,
		-0.00030, 0.00043,
		-0.00208, 0.00334, -0.00316, 0.00136,
		0.23086, 0.05711, 0.19558, 0.05897,
		0.01070, 0.05021, -0.00818, -0.02242,
		0.06301, -0.26483, 0.66177, 0.02125,
		0.13477, 0.19376,
		-0.36520, 0.83588, -0.69848, -0.00877,
		0.01626, -0.23878,
		-0.00373, 0.00044,
		0.00008, -0.00004,
		-0.00374, -0.00283, 0.01104, -0.00619,
		0.00004, 0.00015,
		0.00026, 0.00013,
		0.04630, -0.11815, 0.00773, 0.03796,
		-0.05172, 0.00149, 0.00444, -0.01493,
		-0.00064, -0.00044,
		-0.00033, 0.00002,
		-0.00012, 0.00284,
		-0.15622, -0.92158, -0.82690, -1.52101,
		-0.55934, 0.69375,
		-0.00171, 0.00031,
		0.00129, -0.00013,
		-0.00024, -0.00083,
		0.66101, -0.21764, -0.43967, 0.30157,
		0.53389, 1.59141, 1.94286, 0.14146,
		-0.00064, -0.00006,
		0.21850, -0.02912, 0.08594, 0.08734,
		-0.01678, 0.01629,
		0.00133, 0.00562,
		0.00128, -0.00025,
		-0.00005, 0.00027,
		0.00032, 0.00001,
		0.00037, 0.00042,
		0.00070, 0.00003,
		0.00275, -0.13096, 0.02329, -0.05582,
		0.00405, -0.00251,
		0.01316, -0.01165, 0.00279, -0.00374,
		-39.62783, 20.91467, -28.97236, 3.77560,
		-3.30029, 0.11472, -0.48216, 1.05814,
		-0.21607, -0.03055,
		-0.64162, -0.57355, -0.05861, -0.18592,
		-0.12207, -0.06279,
		-38.55325, -125.74207, -47.22357, 41.75842,
		-119.38841, 18.88515, -11.04830, -50.98851,
		16.64895, 1.76553,
		0.09474, 0.03714,
		0.02593, 0.07967,
		-1187.61854, -1094.91786, -1011.21939, -1102.25998,
		-575.88672, -107.84860, -890.58889, -807.06589,
		971.78461, -1287.24560, -4601.44669, -849.54329,
		-0.00904, 0.06233,
		-0.19456, -0.05521,
		-0.36915, 1.15363,
		32.64763, -85.19705, 114.34437, -13.37747,
		15.92865, 55.84857, -13.10538, 3.07629,
		-0.00327, 0.00104,
		-7.81035, 6.19960, -6.36096, 1.00493,
		-0.66971, -0.84572, 0.09943, -0.04583,
		0.00200, -0.00032,
		-0.00265, 0.00047,
		-0.00053, 0.00046,
		-0.24396, 0.20664, -0.30820, -0.04917,
		0.06184, -0.12642, 0.03053, 0.05054,
		0.00035, 0.00012,
		0.42063, -0.58254, 0.90517, -0.66276,
		0.64765, 0.39338, -1.40645, 0.33017,
		-1.43377, -0.67089,
		-0.00045, -0.00036,
		0.23690, 0.07185, 0.28386, -0.04397,
		0.02836, -0.13082, -0.00978, 0.00108,
		0.00046, 0.00083,
		-0.01665, 0.32499, -0.09980, 0.18611,
		-0.02561, 0.00239, -0.00084, -0.00110,
		0.46854, -0.35113, 0.69908, 0.53244,
		0.12875, 0.01115,
		0.13930, 0.02747, -0.10587, -0.17759,
		-0.26850, 0.04400,
		0.00010, -0.00015,
		0.00164, -0.01308, 0.00488, -0.01046,
		0.00170, 0.00024,
		0.00084, 0.00014,
		-0.08481, -0.02547, -0.02290, -0.02281,
		-0.03946, -0.02810,
		0.01298, 0.08658, 0.05575, -0.01081,
		1.09695, 0.35441,
		-0.03127, 0.07946, 0.01245, 0.02578,
		-0.00524, -0.00027,
		0.08217, -0.31742, 0.15273, -0.07804,
		0.01197, 0.03053,
		0.81596, 0.38640, -0.89777, 0.59499,
		-0.39581, -0.87375,
		0.02096, 0.49772, 0.29986, 0.24210,
		0.14038, -0.03016,
		-0.00208, 0.00045,
		0.01024, 0.00114,
		1.23010, 1.75663, -0.12741, 1.44996,
		-0.31607, 0.03151, 0.00259, -0.04741,
		-11.57091, 8.00331, -9.24028, -6.36906,
		4.71248, -2.43695, 0.38630, 1.90625,
		0.01401, 0.00114,
		33.56690, -55.17784, 33.21425, -52.57002,
		27.04138, 13.78610, 69.60307, -81.16312,
		27.53960, -158.28336, -205.94418, -95.08051,
		-0.01407, -0.00364,
		-18.56128, 6.02270, -10.11059, 24.69471,
		12.31878, 9.94393, 3.81994, -4.84109,
		-1.08440, -0.72136,
		0.03731, -0.02094, 0.00789, -0.00176,
		0.09673, -0.11181, 0.03112, -0.00065,
		-0.29167, -0.82083, 0.40866, -0.77487,
		-2.23349, -0.46973,
		0.41024, -0.14274, 0.07755, -0.24895,
		-0.04965, -0.01197,
		-0.02264, 0.05917, -0.02817, 0.01242,
		-0.00250, -0.00247,
		-0.14414, -0.03739, 0.14708, -0.07908,
		0.05843, 0.15173,
		-0.01601, -0.07844, -0.05957, -0.03143,
		-0.01830, 0.01257,
		-0.00109, -0.00000,
		0.00174, 0.00050,
		-0.02119, 0.06918, -0.02470, 0.00185,
		0.02372, -0.02417,
		0.01081, 0.05222, 0.09820, 0.05931,
		-0.00588, -0.00086,
		0.01688, -0.00133, -0.00073, 0.00041,
		-0.02280, -0.05706, -0.17694, -0.12027,
		0.00196, -0.00060,
		0.00051, -0.02426, 0.00314, -0.00302,
		0.17923, -0.78343, 0.52073, -0.02398,
		-0.03978, 0.20841,
		6.51325, 3.37139, 12.88844, -6.72098,
		3.40949, -14.34313, -9.68278, -7.85143,
		1.06886, -0.21727, 0.36675, -0.49815,
		-0.07289, -0.07537,
		0.01107, -0.00644, 0.01013, -0.00306,
		-0.00708, -0.13488, -0.23041, -0.10698,
		-0.00049, -0.00692, -0.00142, -0.00211,
		-0.04021, 0.01805,
		0.00479, 0.00620,
		0.00739, 0.00566,
		-0.00101, -0.00022, 0.00261, -0.00188,
		-0.01812, -0.01205,
		-0.00061, -0.00061,
		-0.02479, 0.01157,
		0.91642, -0.65781, 0.39969, -1.13699,
		-0.43337, -0.57828,
		0.00145, 0.00281,
		-0.01675, -0.00975,
		0.00119, -0.00074,
		-0.00343, 0.00139,
		0.00061, 0.00086,
		0.00054, -0.00046,
		-0.01996, -0.02689,
		0.00034, 0.00037,
		-0.00006, 0.00001
	],
	rad_tbl: [
		-734.58857, -1081.04460, -551.65750, -148.79782,
		-25.23171, 164.64781, 248.64813,
		-0.05163, -0.02413,
		-1306.61004, 560.02437, -1622.58047, 589.92513,
		-812.39674, 166.85340, -157.92826, -107.14755,
		68.98900, -18.95875, -0.16183, 36.24345,
		-9.19972, -2.29315,
		-0.00316, 0.00222,
		10.95234, 21.37177, -6.29550, 21.83656,
		-7.70755, 1.38228, -0.21770, -1.49525,
		0.17951, 0.01043,
		0.00062, 0.00208, -0.00066, 0.00050,
		0.00313, 0.00187,
		0.00010, 0.00131,
		0.00102, 0.00047,
		0.00102, 0.00012,
		0.00012, -0.00037,
		0.00808, 0.00027,
		-0.01219, -0.00961, -0.04166, -0.00327,
		-0.00001, -0.00146,
		-0.00092, -0.00989,
		-0.00135, 0.00196,
		0.19216, 2.48442, -1.43599, 1.39651,
		-0.48549, -0.53272, 0.14066, -0.10352,
		0.00141, 0.00066,
		2.96838, -3.09575, 6.27741, 5.24306,
		-8.77080, 9.03247, -10.98350, -3.58579,
		-0.00168, -0.00100,
		0.20234, -0.75737, 0.36838, -0.58241,
		0.41430, -0.35784, 0.47038, -0.10586,
		0.00539, 0.00490,
		-0.01375, -0.01950, 0.00145, 0.00723,
		-0.00391, 0.00391,
		-0.00131, -0.00568,
		0.01317, 0.00319,
		1.31006, 5.89394, -1.61753, 3.68814,
		-0.80644, -0.14747, 0.04481, -0.11361,
		-4.36130, 7.92488, -16.29047, -1.52163,
		2.14492, -14.38028, 9.65573, 3.56881,
		-1.87208, 3.36213,
		1.84499, -2.41575, -2.77076, -3.23915,
		-3.34573, 1.40979,
		0.00217, -0.00841,
		0.29313, -0.36246, 0.22043, 0.02328,
		-0.01182, 0.04074,
		-0.15728, 0.02468, -0.03185, -0.01099,
		0.01059, -0.01274,
		0.07362, -0.02642, 0.04035, -0.00968,
		-2.14457, 2.53297, -4.34196, -0.11421,
		-0.38757, -1.73872, 0.39784, -0.01397,
		-0.03311, 0.97723, 0.16060, -0.07486,
		25.96413, 0.75088,
		-3.04736, 0.30340, -1.43451, -1.35136,
		0.26526, -0.40247,
		-0.00460, -0.00056,
		0.01633, -0.00128,
		-0.05197, 0.07002, -0.19450, 0.03737,
		0.00188, -0.00037,
		-0.00903, -0.00059,
		-19.73809, 0.58424, -10.42034, -10.14579,
		2.65990, -3.07889, 0.50884, 0.58508,
		-0.00970, 0.02099,
		0.00716, 0.01161,
		0.05751, -0.04515,
		22.08042, 30.82415, -36.27430, 31.40265,
		-18.30150, -29.16403,
		0.02454, 0.01834,
		-0.01312, 0.01576,
		-0.00928, 0.00330,
		-11.78094, 4.06738, -2.51590, 15.05277,
		9.12747, 2.88088, 2.32916, -2.08271,
		0.02872, 0.02194,
		0.60494, -0.04597, 0.24749, 0.15971,
		-0.02185, 0.03384,
		-0.07075, 0.01287,
		0.40201, 0.00347,
		-0.00410, -0.00998,
		-0.00005, -0.00121,
		0.13770, 0.00186,
		-0.02268, 0.00210,
		1.26291, 0.65546, 0.38885, 0.38880,
		-0.00184, 0.03067,
		0.01273, 0.01136, 0.00557, 0.01117,
		94.13171, -88.37882, 120.53292, 8.32903,
		7.77313, 43.46523, -11.66698, 0.44639,
		0.15092, -1.68367,
		-0.30833, -0.49030, 0.01971, -0.14144,
		-0.04019, -0.05110,
		-39.70024, 272.91667, -468.46263, 256.77696,
		-200.63130, -307.98554, 206.56301, -41.76039,
		-4.74242, 74.19909,
		0.18474, 0.05547,
		-0.06732, 0.16515,
		-1156.31285, -1102.97666, -1346.99288, -1121.01090,
		666.84550, 421.92305, 2259.49740, -2268.69758,
		-2325.87639, -4476.46256, -9683.77583, -2472.92565,
		-0.10400, 0.08075,
		-0.45225, 0.16621,
		0.57789, 2.43804,
		85.21675, -154.17208, 219.91042, -9.71116,
		31.13240, 108.60117, -25.85622, 8.98402,
		-0.00233, 0.01030,
		-17.01324, 10.41588, -13.34449, 1.08782,
		-1.48199, -1.81734, 0.20334, -0.11734,
		-0.00230, -0.01869,
		-0.01182, -0.00129,
		-0.00281, 0.02021,
		-5.75973, 19.13309, -16.13690, 5.53382,
		-1.96585, -6.29211, 1.63105, -0.26089,
		0.02935, -0.00555,
		0.30700, -19.96182, 0.99825, -16.32664,
		0.83052, -13.76201, -3.15609, 0.17360,
		-111.81423, -2.05419,
		-0.02455, -0.00478,
		7.45114, 21.53296, 19.90263, 5.69420,
		2.31253, -8.15116, -2.17440, -0.23014,
		0.00168, 0.01590,
		8.78005, 0.71418, 4.48561, 4.50680,
		-1.05713, 1.17880, -0.19327, -0.24877,
		-5.00870, -8.66354, 10.51902, -7.71011,
		4.65486, 8.05673,
		-1.39635, -3.07669, -2.40347, -0.11167,
		-0.04064, 0.83512,
		-0.02041, -0.00351,
		0.97375, -0.15795, 0.36361, 0.19913,
		-0.02142, 0.04193,
		0.08801, 0.00475,
		-2.81010, 3.11341, -2.79191, -0.93313,
		0.44570, -0.88287,
		-0.51815, 0.54776, 0.29736, 0.99779,
		2.28957, 0.82183,
		0.03386, 0.12855, 0.03124, 0.02454,
		-0.31958, 0.00070,
		-1.48184, -1.28195, 0.03965, -1.12026,
		0.23910, 0.01293,
		0.36146, -0.64483, -1.88470, 0.21469,
		-11.79819, -1.87287,
		2.65699, -0.36287, 0.88148, -1.26883,
		-0.19657, -0.14279,
		-0.07536, -0.00004,
		0.01496, 0.00537,
		2.48352, 3.75581, -0.34909, 3.26696,
		-0.82105, 0.11287, -0.00755, -0.13764,
		-15.34429, -2.79957, -3.22976, -15.46084,
		10.66793, -0.26054, -0.12188, 5.06211,
		0.01313, 0.00424,
		84.34332, -57.05646, 92.68150, -0.02024,
		149.62698, 59.14407, 174.04569, -129.26785,
		-55.99789, -238.01484, -212.51618, -115.94914,
		-0.01720, -0.00158,
		-13.65602, 17.47396, 0.16714, 32.66367,
		16.30095, 9.18345, 3.98555, -5.39985,
		-1.09958, -0.86072,
		0.02752, -0.02474, 0.00671, -0.00278,
		-0.21030, -0.73658, 0.20708, -0.21378,
		0.78462, -2.14051, -1.60070, -2.60915,
		-5.02441, -1.19246,
		0.67622, -0.41889, 0.07430, -0.53204,
		-0.11214, -0.03417,
		-0.72636, -0.15535, -0.16815, -0.35603,
		0.07530, -0.02521,
		-0.01261, -0.94883, 0.39930, -0.05370,
		-2.77309, 0.38431,
		0.72127, -0.52030, -0.01804, -0.51188,
		-0.11993, 0.02189,
		0.00928, -0.02129,
		-0.02760, 0.00441,
		-0.56832, -0.48114, 0.64192, -0.65656,
		0.37483, 0.51883,
		-0.08474, 0.20324, 0.12783, 0.13041,
		-0.01545, -0.00282,
		-0.16196, -0.26980, 0.06584, -0.09987,
		-0.36305, -0.27610, -0.57074, -0.13607,
		-0.00824, 0.00369,
		0.06094, -0.12214, 0.03581, -0.00876,
		0.49346, -0.74596, 0.47814, 0.18201,
		-1.00640, 0.24465,
		10.09808, 2.30496, 13.63359, -7.94007,
		0.29792, -13.55724, -6.48556, -5.99581,
		0.69686, -0.22434, 0.23198, -0.35579,
		-0.04736, -0.05683,
		0.36710, -0.16571, 0.14876, 0.21824,
		-0.18940, -0.15063, -0.23692, -0.09990,
		-0.08923, -0.12222, 0.02998, -0.04560,
		-0.16229, 0.04552,
		-0.33051, 0.02585,
		-0.00622, 0.01583,
		0.15436, -0.07109, 0.06429, 0.09218,
		-0.01277, -0.00019,
		0.02345, -0.01057,
		-0.07294, 0.02506,
		0.62063, -0.52533, 0.16814, -0.77168,
		-0.20614, -0.31828,
		-0.12856, 0.01316,
		-0.01522, -0.00126,
		0.01558, 0.04765,
		-0.02776, 0.01166,
		-0.05185, 0.00674,
		0.00754, 0.02183,
		-0.00645, -0.01050,
		-0.02155, 0.00375,
		0.12040, -0.00004
	],
	arg_tbl: [
		0, 6,
		3, 2, 5, -6, 6, 3, 7, 0,
		2, 2, 5, -5, 6, 6,
		3, 1, 5, -2, 6, -3, 8, 0,
		2, 4, 5, -10, 6, 4,
		3, 2, 5, -4, 6, -3, 7, 1,
		3, 3, 5, -10, 6, 7, 7, 0,
		2, 6, 5, -15, 6, 0,
		3, 1, 5, -4, 6, 4, 7, 0,
		3, 3, 5, -8, 6, 2, 7, 0,
		3, 1, 5, -3, 6, 1, 7, 0,
		3, 1, 5, -3, 6, 2, 7, 0,
		1, 1, 7, 1,
		2, 5, 5, -12, 6, 0,
		3, 2, 5, -7, 6, 7, 7, 0,
		3, 1, 5, -1, 6, -3, 7, 0,
		2, 3, 5, -7, 6, 3,
		3, 1, 5, -4, 6, 3, 7, 0,
		2, 1, 5, -2, 6, 3,
		3, 3, 5, -8, 6, 3, 7, 0,
		2, 1, 5, -3, 6, 3,
		3, 1, 5, -3, 6, 3, 7, 0,
		2, 3, 5, -8, 6, 2,
		3, 2, 5, -5, 6, 2, 7, 0,
		1, 2, 7, 0,
		2, 4, 5, -9, 6, 3,
		2, 2, 5, -4, 6, 4,
		1, 1, 6, 2,
		3, 2, 5, -5, 6, 3, 7, 0,
		2, 2, 5, -6, 6, 2,
		2, 5, 5, -11, 6, 1,
		3, 1, 5, -2, 7, -2, 8, 0,
		2, 1, 5, -3, 7, 1,
		2, 3, 5, -6, 6, 3,
		2, 1, 5, -1, 6, 2,
		2, 1, 5, -4, 6, 2,
		2, 3, 5, -9, 6, 0,
		3, 2, 5, -4, 6, 2, 7, 0,
		2, 1, 5, -2, 7, 1,
		2, 6, 5, -13, 6, 0,
		3, 2, 5, -2, 6, -3, 7, 0,
		2, 4, 5, -8, 6, 3,
		2, 3, 6, -3, 7, 0,
		3, 6, 5, -14, 6, 3, 7, 0,
		3, 1, 5, -2, 7, 1, 8, 0,
		2, 2, 5, -3, 6, 2,
		3, 1, 5, -4, 7, 5, 8, 0,
		3, 2, 5, -8, 6, 3, 7, 0,
		3, 4, 5, -9, 6, 3, 7, 0,
		1, 2, 6, 3,
		3, 2, 5, -4, 6, 3, 7, 0,
		2, 2, 5, -7, 6, 2,
		2, 1, 5, -2, 8, 0,
		2, 1, 5, -1, 7, 0,
		3, 3, 5, -6, 6, 2, 7, 0,
		3, 4, 5, -8, 6, 2, 8, 0,
		2, 1, 5, -1, 8, 0,
		3, 2, 5, -3, 6, 1, 7, 0,
		2, 7, 5, -15, 6, 2,
		3, 3, 5, -4, 6, -3, 7, 1,
		2, 5, 5, -10, 6, 4,
		3, 1, 5, 1, 6, -3, 7, 1,
		3, 7, 5, -16, 6, 3, 7, 0,
		2, 3, 5, -5, 6, 4,
		3, 1, 5, -6, 6, 3, 7, 0,
		3, 5, 5, -11, 6, 3, 7, 0,
		1, 1, 5, 5,
		3, 3, 5, -11, 6, 3, 7, 0,
		3, 3, 5, -6, 6, 3, 7, 0,
		2, 2, 5, -7, 7, 0,
		2, 1, 5, -5, 6, 3,
		3, 1, 5, -1, 6, 3, 7, 0,
		2, 3, 5, -10, 6, 3,
		3, 2, 5, -3, 6, 2, 7, 0,
		2, 1, 5, 1, 7, 0,
		3, 2, 5, -1, 6, -3, 7, 0,
		2, 4, 5, -7, 6, 3,
		2, 4, 6, -3, 7, 0,
		2, 2, 5, -2, 6, 4,
		3, 4, 5, -8, 6, 3, 7, 0,
		1, 3, 6, 3,
		3, 2, 5, -3, 6, 3, 7, 0,
		2, 5, 5, -9, 6, 3,
		2, 3, 5, -4, 6, 2,
		2, 1, 5, 1, 6, 2,
		2, 2, 5, -4, 7, 0,
		2, 6, 5, -11, 6, 2,
		2, 2, 5, -3, 7, 0,
		2, 4, 5, -6, 6, 2,
		2, 2, 5, -1, 6, 2,
		1, 4, 6, 1,
		2, 2, 5, -2, 7, 0,
		2, 5, 5, -8, 6, 2,
		2, 3, 5, -3, 6, 2,
		2, 1, 5, 2, 6, 2,
		2, 2, 5, -2, 8, 0,
		2, 2, 5, -1, 7, 0,
		2, 6, 5, -10, 6, 3,
		2, 4, 5, -5, 6, 3,
		2, 6, 6, -3, 7, 0,
		1, 2, 5, 5,
		3, 4, 5, -6, 6, 3, 7, 0,
		1, 5, 6, 4,
		2, 2, 5, -10, 6, 1,
		2, 5, 5, -7, 6, 1,
		2, 3, 5, -2, 6, 2,
		2, 1, 5, 3, 6, 2,
		2, 6, 5, -9, 6, 2,
		2, 4, 5, -4, 6, 2,
		2, 2, 5, 1, 6, 2,
		2, 7, 5, -11, 6, 0,
		2, 3, 5, -3, 7, 0,
		2, 5, 5, -6, 6, 2,
		2, 3, 5, -1, 6, 1,
		2, 3, 5, -2, 7, 0,
		2, 6, 5, -8, 6, 1,
		2, 4, 5, -3, 6, 1,
		2, 2, 5, 2, 6, 0,
		2, 7, 5, -10, 6, 1,
		2, 5, 5, -5, 6, 2,
		1, 3, 5, 3,
		2, 1, 5, 5, 6, 2,
		2, 6, 5, -7, 6, 1,
		2, 4, 5, -2, 6, 1,
		2, 7, 5, -9, 6, 1,
		2, 5, 5, -4, 6, 0,
		2, 6, 5, -6, 6, 0,
		2, 4, 5, -1, 6, 0,
		2, 7, 5, -8, 6, 1,
		2, 5, 5, -3, 6, 0,
		2, 8, 5, -10, 6, 0,
		2, 6, 5, -5, 6, 0,
		1, 4, 5, 2,
		2, 7, 5, -7, 6, 0,
		2, 5, 5, -2, 6, 0,
		2, 8, 5, -9, 6, 0,
		2, 7, 5, -6, 6, 0,
		2, 8, 5, -8, 6, 0,
		2, 9, 5, -10, 6, 0,
		1, 5, 5, 0,
		2, 9, 5, -9, 6, 0,
		2, 1, 3, -1, 5, 0,
		-1
	]
};

// saturn.js
$ns.saturn = {
	maxargs: 9,
	max_harmonic: [0, 0, 1, 0, 8, 18, 9, 5, 0],
	max_power_of_t: 7,
	distance: 9.5575813548599999e+00,
	timescale: 3652500.0,
	trunclvl: 1.0,
	lon_tbl: [
		1788381.26240, 2460423.68044, 1370113.15868, 415406.99187,
		72040.39885, 12669.58806, 439960754.85333, 180256.80433,
		18.71177, -40.37092,
		66531.01889, -195702.70142, 57188.02694, -179110.60982,
		-19803.06520, -58084.15705, -9055.13344, -31146.10779,
		11245.43286, -3247.59575, 459.48670, 2912.82402,
		-4.06749, -13.53763,
		-30.55598, -4.51172,
		1.48832, 0.37139,
		597.35433, 1193.44545, -297.50957, 976.38608,
		-263.26842, 34.84354, -6.77785, -29.92106,
		-0.16325, -0.18346,
		-0.15364, -0.08227,
		0.20180, 0.02244,
		0.04672, -0.29867,
		-0.04143, -0.00760,
		-0.17046, -0.00778,
		0.04200, 0.23937, -0.00098, -0.05236,
		-0.02749, -0.01813,
		0.00637, 0.01256,
		-0.04506, 0.04448,
		-0.00105, 0.06224,
		0.01157, 0.17057, -0.03214, 0.18178,
		-0.22059, -0.01472,
		-0.24213, 0.04309, 0.03436, 0.44873,
		0.01350, -0.01931,
		-0.80618, -0.56864, 0.29223, -0.03101,
		0.04171, 0.02264,
		-0.01264, -0.01645,
		0.01774, 0.06374,
		-0.01925, -0.03552,
		0.10473, -0.04119,
		0.08045, 0.04635,
		-3.01112, -9.26158, 8.13745, 1.88838,
		-0.15184, 0.16898,
		-0.22091, 0.29070, -0.03259, 0.06938,
		-0.08499, -0.21688, 0.01848, -0.05594,
		0.50100, -0.00027, 0.13300, 0.12055,
		0.03039, 0.03854,
		-1.55287, 2.55618, -0.45497, -0.29895,
		-0.93268, 0.83518,
		-0.32785, 7.03878, -1.66649, 2.75564,
		-0.29459, 0.01050,
		0.08293, -0.03161,
		-0.12750, -0.04359,
		0.04217, 0.07480,
		-114.43467, 49.47867, -66.52340, -26.27841,
		15.48190, -13.06589, 3.28365, 5.02286,
		-0.17155, -0.07404,
		0.00924, -0.07407,
		-0.02922, 0.06184,
		108.04882, 86.09791, -155.12793, 208.10044,
		-311.72810, -268.92703, 74.57561, -420.03057,
		-0.07893, 0.09246,
		-0.66033, -0.39026, -0.13816, -0.08490,
		-36.79241, -78.88254, 71.88167, -68.05297,
		51.71616, 65.77970, -43.59328, 23.51076,
		-0.02029, -0.32943,
		-8.82754, 1.48646, -3.12794, 2.12866,
		-0.06926, 0.44979,
		0.00621, -0.51720,
		-3.82964, -1.48596, -0.11277, -3.21677,
		0.81705, -0.19487,
		-0.06195, 0.10005, -0.02208, 0.00108,
		0.00455, -0.03825,
		0.01217, -0.00599,
		-0.17479, -0.47290, 0.85469, 1.12548,
		-0.80648, -0.44134,
		-0.01559, -0.07061,
		0.01268, -0.01773,
		0.01308, -0.03461,
		-0.71114, 1.97680, -0.78306, -0.23052,
		0.94475, -0.10743,
		0.18252, -8.03174,
		0.00734, 0.04779,
		0.12334, -0.03513,
		0.01341, 0.02461,
		0.02047, -0.03454,
		0.02169, -0.01921,
		-1.12789, 0.09304, 0.14585, 0.36365,
		0.03702, 0.10661, -0.00464, -1.72706,
		-0.00769, -0.04635,
		-0.01157, 0.00099,
		10.92646, 1.96174, 2.91142, 4.74585,
		-0.29832, 0.75543,
		0.05411, 1.05850,
		0.38846, -0.16265,
		1.52209, 0.12185, 0.18650, 0.35535,
		-278.33587, -82.58648, -160.00093, -225.55776,
		35.17458, -77.56672, 10.61975, 3.33907,
		0.06090, 2.17429,
		-4.32981, -5.84246, 11.43116, 20.61395,
		-0.65772, 1.28796,
		1224.46687, -3113.15508, 3798.33409, -137.28735,
		-256.89302, 2227.35649, -779.78215, -260.37372,
		11.73617, -13.25050, -0.75248, -2.87527,
		-8.38102, 17.21321,
		-61784.69616, 39475.02257, -54086.68308, 54550.85490,
		-16403.69351, 29602.70098, 14672.06363, 16234.17489,
		15702.37109, -22086.30300, -22889.89844, -1245.88352,
		1.48864, 19.75000, 0.78646, 3.29343,
		-1058.13125, 4095.02368, -2793.78506, 1381.93282,
		-409.19381, -772.54270, 161.67509, -34.15910,
		-514.27437, 27.34222, -311.04046, 48.01030,
		-43.36486, 16.19535, -0.73816, -0.81422,
		287.32231, -110.44135, 200.43610, 37.98170,
		17.73719, 34.40023, -2.46337, 1.48125,
		0.09042, -0.11788,
		0.37284, 0.51725, 0.00597, 0.14590,
		-0.01536, 0.00980,
		0.00721, 0.02023,
		0.00027, 0.02451,
		-0.72448, -0.71371, 0.29322, 0.18359,
		0.72719, -0.37154, 0.14854, -0.02530,
		0.23052, 0.04258,
		4.82082, 0.01885, 3.11279, -0.63338,
		0.10559, -0.02146,
		-0.01672, 0.03412,
		0.00605, 0.06415,
		-0.89085, 1.51929, -0.36571, 0.39317,
		12.05250, -3.79392, 3.96557, -3.51272,
		-0.17953, 12.30669,
		-0.05083, -0.11442,
		0.02013, -0.02837,
		-0.02087, -0.01599,
		0.49190, 0.30360, 0.01316, 0.17649,
		0.21193, -0.09149, -0.07173, -0.05707,
		4.24196, -1.25155, 1.81336, 0.68887,
		-0.01675, 0.20772,
		-0.04117, -0.03531,
		-0.02690, -0.02766,
		37.54264, 10.95327, 8.05610, 30.58210,
		-12.68257, 1.72831, 0.13466, -3.27007,
		0.01864, -0.00595,
		0.03676, 0.14857, -0.07223, 0.06179,
		0.44878, -1.64901, -20.06001, 0.63384,
		-4.97849, 4.78627, 29.87370, 7.29899,
		0.00047, -0.00155,
		0.00314, 0.01425,
		-0.17842, -0.08461,
		-1.61020, -8.47710, 6.85048, -4.38196,
		1.05809, 2.68088,
		-0.01027, -0.00833,
		0.06834, -0.04205,
		0.03330, -0.01271,
		0.01301, -0.01358,
		0.03537, 0.03612, 0.02962, 0.62471,
		-0.30400, -0.64857,
		0.01773, 0.01890,
		0.01426, -0.00226,
		-0.50957, -0.01955, -0.09702, 1.09983,
		0.64387, -0.02755,
		0.26604, 0.30684, 0.06354, 0.05114,
		-0.00058, -0.04672,
		-0.00828, 0.00712,
		-0.00440, 0.00029,
		-0.01601, 0.03566,
		0.13398, -0.02666,
		-0.06752, -0.43044, 0.07172, -0.01999,
		-0.01761, -0.05357,
		0.06104, 0.29742, -0.08785, 0.05241,
		-6.57162, -4.20103, 0.03199, -6.46187,
		1.32846, -0.51137,
		0.06358, 0.37309,
		-1.46946, 2.34981,
		-0.18712, 0.11618,
		240.62965, -107.21962, 219.81977, 84.04246,
		-62.22931, 68.35902, -9.48460, -32.62906,
		5.57483, -1.82396, 1.00095, -0.39774,
		7.87054, 11.45449,
		-432.67155, 55064.72398, 12444.62359, 54215.28871,
		8486.03749, 12297.48243, -333.27968, 1147.93192,
		1403.73797, 990.40885, -3.84938, -722.43963,
		16.83276, 96.48787, 7.04834, 38.22208,
		0.63843, 2.61007,
		230.73221, 171.64166, 1.96751, 287.80846,
		-85.21762, 31.33649, -2.25739, -11.28441,
		0.04699, 0.06555,
		-0.08887, 1.70919, 0.09477, 0.26291,
		-0.15490, 0.16009,
		1.93274, 1.01953, 0.36380, 1.29582,
		-0.13911, 0.14169,
		-0.00491, -0.00030,
		-0.08908, -0.10216,
		-0.03265, -0.03889,
		0.40413, -1.12715, -0.94687, -0.04514,
		0.02487, -0.01048,
		0.39729, 2.82305, -0.61100, 1.11728,
		-0.13083, -0.04965,
		-0.00602, -0.02952,
		-6.13507, 13.73998, -15.70559, -1.28059,
		2.64422, -9.33798, 3.26470, 1.56984,
		-0.00572, 0.09992,
		-8.80458, -8.23890, -11.51628, 9.47904,
		11.31646, 4.29587,
		-2.41367, -0.05883, -0.80022, -1.02706,
		0.21461, -0.06864,
		0.01882, 0.01798,
		0.27614, -0.01007, 0.04362, 0.07560,
		0.05519, 0.23435,
		-0.09389, 0.01613,
		0.01298, 0.04691,
		-0.02665, -0.03582,
		0.60080, -4.28673, 1.87316, -1.05840,
		0.13248, 0.40887,
		-0.67657, 0.67732, 0.05522, 0.07812,
		-0.17707, -0.07510,
		0.24885, 10.63974, -7.40226, -2.33827,
		2.75463, -32.51518,
		0.05140, 0.01555,
		180.43808, 263.28252, 384.50646, -76.53434,
		-93.50706, -220.50123, -81.91610, 103.92061,
		30.90305, -2.89292,
		-0.06634, -0.37717, -0.01945, -0.05936,
		29.27877, -59.73705, 35.86569, -18.36556,
		3.88812, 4.82090, -0.70903, 0.06615,
		0.01558, -0.01854,
		0.16209, 0.12682, 0.02508, 0.02406,
		-0.03078, -0.01737, -0.00033, -0.00020,
		0.01023, 0.05972,
		-0.03373, -0.07289,
		-2.08162, -0.14717, -0.64233, -0.75397,
		0.11752, -0.09202,
		4.42981, -4.19241, 5.02542, 5.03467,
		-4.22983, 2.80794,
		3.03016, -2.74373, -1.11490, -2.72378,
		-0.63131, 0.74864,
		-0.00759, -0.00675,
		0.03615, -0.01806,
		-2.71920, -1.50954, 0.54479, -1.92088,
		0.66427, 0.32228,
		-2.55188, -0.65332, -2.73798, 2.10182,
		1.54407, 3.01357,
		38.76777, 23.54578, 27.29884, -14.93005,
		-7.50931, -5.66773, 0.30142, 1.52416,
		0.00634, 0.09697, -0.00748, 0.01433,
		0.02936, 0.53228, -0.03603, 0.06345,
		0.30816, -1.07925, 0.46709, -0.21568,
		0.01663, 0.10810,
		-0.42511, 0.35872, -0.19662, -6.74031,
		1.05776, 1.86205, 1.08919, 0.10483,
		-0.03368, -0.21535,
		0.07556, -0.27104, 0.05142, -0.03812,
		1.20189, -1.36782, 1.35764, 1.39387,
		-1.19124, 0.77347,
		-0.54760, -0.26295, -0.07473, 0.23043,
		2.82621, -0.23524, 0.47352, -0.81672,
		-0.08515, 0.04700,
		0.55355, -0.40138, 0.22255, 0.12236,
		-0.09110, 0.31982, 0.39404, -0.17898,
		-0.00056, 0.00014,
		-0.02012, 0.03102,
		0.43236, -0.10037, -0.00961, 0.07440,
		-0.07076, -1.97272,
		0.25555, -0.21832, -0.00837, -0.08393,
		0.01531, 0.00627,
		0.33193, 0.70765, -0.43556, 0.28542,
		-0.23190, -0.04293, -0.08062, 0.13427,
		0.23763, -0.17092, 0.09259, 0.05155,
		0.08065, -0.11943,
		-0.02174, -0.68899,
		-0.01875, -0.01746,
		0.13604, 0.29280, -0.17871, 0.11799,
		0.02003, 0.04065,
		0.01343, -0.06060,
		-0.01290, -0.26068,
		-0.09033, 0.02649,
		-0.00092, -0.03094,
		-0.00770, -0.10447,
		-0.04113, 0.01259,
		-0.00469, -0.04346,
		-0.00010, 0.06547
	],
	lat_tbl: [
		-567865.62548, -796277.29029, -410804.00791, -91793.12562,
		-6268.13975, 398.64391, -710.67442, 175.29456,
		-0.87260, 0.18444,
		-1314.88121, 20709.97394, -1850.41481, 20670.34255,
		-896.96283, 6597.16433, -179.80702, 613.45468,
		17.37823, -13.62177, -0.36348, 12.34740,
		0.47532, 0.48189,
		0.27162, -0.20655,
		-0.23268, 0.05992,
		46.94511, 15.78836, 21.57439, 23.11342,
		-0.25862, 5.21410, -0.22612, -0.05822,
		-0.00439, -0.01641,
		-0.01108, -0.00608,
		0.00957, 0.00272,
		-0.00217, 0.00001,
		-0.00534, -0.00545,
		0.00277, -0.00843,
		0.00167, -0.00794, 0.00032, -0.00242,
		-0.00002, -0.00041,
		-0.00025, 0.00031,
		0.00062, -0.00060,
		0.00083, 0.00032,
		0.00527, -0.00211, 0.00054, 0.00004,
		-0.02769, -0.01777,
		0.00247, 0.00097, 0.00020, -0.00232,
		0.00044, -0.00035,
		-0.00072, 0.01341, 0.00325, -0.01159,
		0.00079, -0.00078,
		-0.00009, 0.00066,
		0.00222, 0.00002,
		0.00013, -0.00161,
		0.01374, -0.05305,
		0.00478, -0.00283,
		0.16033, 0.13859, 0.33288, -0.16932,
		-0.00316, 0.00625,
		-0.00309, 0.01687, 0.00001, 0.00486,
		0.00401, -0.01805, -0.00048, -0.00407,
		-0.01329, 0.01311, -0.00591, 0.00166,
		0.00830, 0.00665,
		-0.80207, 0.22994, -0.34687, 0.08460,
		-0.11499, -0.01449,
		-0.01574, 0.78813, -0.03063, 0.28872,
		-0.00337, 0.01801,
		-0.01703, -0.00929,
		-0.00738, 0.03938,
		0.05616, -0.00516,
		-3.09497, 30.13091, -3.14968, 17.62201,
		-0.73728, 2.46962, -0.11233, 0.03450,
		-0.07837, -0.01573,
		-0.01595, 0.00394,
		0.00174, 0.01470,
		6.83560, -2.37594, 4.95125, 3.24711,
		2.44781, 5.17159, 1.99820, -2.38419,
		0.00840, 0.03614,
		-0.00209, -0.30407, -0.02681, -0.06128,
		1.50134, 11.82856, 4.39644, 6.98850,
		-4.17679, 5.73436, -9.66087, 1.98221,
		-0.29755, 0.08019,
		-0.24766, -8.54956, -1.74494, -3.36794,
		-0.32661, -0.00722,
		0.14141, 0.01023,
		-1.21541, -2.58470, 0.38983, -1.70307,
		0.31209, -0.10345,
		0.02593, 0.02178, 0.00289, 0.00393,
		-0.00236, -0.00373,
		-0.00270, -0.00049,
		-0.06282, -0.00443, -0.02439, -0.02254,
		-0.02220, 0.03532,
		-0.00072, 0.00010,
		-0.00049, -0.00112,
		0.00086, 0.00112,
		0.10135, -0.10972, 0.08357, 0.00155,
		0.04363, -0.00201,
		-0.01996, -0.01341,
		-0.00039, -0.00042,
		-0.00294, 0.00070,
		0.00005, -0.00027,
		0.00070, -0.00076,
		0.00234, -0.00239,
		-0.08365, -0.08531, -0.03531, 0.15012,
		-0.01995, -0.01731, -0.00370, -0.00745,
		-0.00315, -0.00079,
		-0.00120, -0.00145,
		-0.99404, -1.31859, 0.03584, -0.83421,
		0.10720, -0.05768,
		0.06664, -0.09338,
		-0.01814, -0.00003,
		-0.05371, -0.06458, -0.00100, -0.01298,
		-7.08710, -23.13374, 4.18669, -19.94756,
		4.85584, -3.37187, 0.58851, 0.31363,
		0.01994, 0.27494,
		-1.37112, 2.61742, 0.52477, -0.46520,
		-0.13183, 0.26777,
		836.90400, -484.65861, 815.99098, 236.54649,
		-32.38814, 288.95705, -68.17178, -18.87875,
		-1.79782, -3.68662, -1.27310, -0.65697,
		-3.67530, 2.10471,
		-13758.97795, 4807.62301, -14582.14552, 9019.73021,
		-3202.60105, 4570.16895, 2078.68911, 2892.62326,
		-2399.35382, 3253.16198, -8182.38152, -3588.77680,
		-0.16505, 1.08603, 0.53388, 0.87152,
		61.53677, 538.43813, -407.32927, 322.27446,
		-148.71585, -179.37765, 54.07268, -34.12281,
		-14.76569, -17.95681, -10.82061, -6.39954,
		-2.10954, 0.67063, 0.22607, -0.43648,
		20.90476, -45.48667, 30.39436, -14.20077,
		5.17385, 5.12726, -0.66319, 0.55668,
		0.02269, -0.00016,
		0.07811, 0.00111, 0.01603, 0.01020,
		-0.00107, 0.00494,
		-0.00077, -0.00084,
		-0.00196, 0.00081,
		-0.03776, 0.01286, -0.00652, -0.01450,
		0.05942, -0.08612, 0.01093, -0.01644,
		0.02147, -0.00592,
		0.36350, -0.00201, 0.14419, -0.10070,
		-0.00491, -0.01771,
		-0.00053, -0.00033,
		0.00146, 0.00048,
		0.00582, 0.04423, -0.00549, 0.00983,
		0.27355, -0.38057, 0.24001, -0.05441,
		-0.07706, 0.14269,
		-0.00059, -0.00154,
		-0.00013, -0.00088,
		-0.00046, 0.00029,
		-0.00276, -0.00507, 0.00075, -0.00076,
		0.01806, 0.00862, -0.00510, -0.01364,
		-0.00029, -0.12664, 0.03899, -0.03562,
		0.00318, 0.00514,
		0.00057, 0.00201,
		0.00028, 0.00014,
		-0.47022, -0.74561, 0.40155, -0.16471,
		-0.18445, 0.34425, -0.07464, -0.13709,
		-0.01018, -0.00748,
		-0.01210, -0.04274, -0.00579, -0.00692,
		-11.09188, -1.67755, -6.62063, -13.84023,
		12.75563, -6.73501, 8.31662, 5.40196,
		0.00052, 0.00034,
		0.00128, 0.00085,
		-0.02202, -0.00599,
		-0.33458, -1.65852, 1.47003, -1.02434,
		0.87885, 1.15334,
		-0.00241, -0.00721,
		0.03154, 0.00612,
		0.00318, -0.02521,
		0.00042, 0.00213,
		-0.01094, 0.05417, -0.03989, -0.00567,
		0.00123, -0.00244,
		0.00108, 0.00242,
		-0.00138, -0.00099,
		0.04967, 0.01643, -0.00133, 0.02296,
		0.12207, 0.05584,
		0.00437, -0.04432, -0.00176, -0.00922,
		-0.00252, 0.00326,
		-0.00020, -0.00050,
		-0.00263, -0.00084,
		-0.01971, 0.00297,
		0.03076, 0.01736,
		-0.01331, 0.01121, -0.00675, 0.00340,
		-0.00256, 0.00327,
		-0.00946, 0.03377, -0.00770, 0.00337,
		0.61383, 0.71128, -0.02018, 0.62097,
		-0.07247, 0.04418,
		-0.02886, -0.03848,
		-0.44062, 0.03973,
		-0.00999, -0.04382,
		57.94459, 117.45112, -71.22893, 126.39415,
		-62.33152, -31.90754, 12.17738, -16.46809,
		-1.13298, 0.08962, -0.20532, 0.16320,
		-1.55110, -1.44757,
		-3102.08749, -7452.61957, -5009.53858, -7216.29165,
		-2476.87148, -1880.58197, -574.49433, 227.45615,
		144.50228, 379.15791, 225.36130, -443.47371,
		-8.51989, -3.75208, -4.25415, -1.59741,
		-0.43946, -0.06595,
		150.42986, 6.54937, 87.67736, 92.32332,
		-21.97187, 29.87097, -4.21636, -5.72955,
		-0.03879, -0.01071,
		-0.45985, 0.02679, -0.02448, 0.02397,
		-0.06551, -0.01154,
		1.97905, -0.82292, 1.10140, 0.30924,
		0.03389, 0.14230,
		0.00003, 0.00119,
		-0.01117, 0.00665,
		-0.00132, -0.00576,
		-0.08356, 0.08556, -0.26362, -0.12450,
		0.00509, 0.00165,
		0.02591, 0.16200, -0.03318, 0.06463,
		-0.00899, -0.00462,
		0.00102, 0.00004,
		-0.73102, 0.08299, -0.52957, -0.35744,
		0.14119, -0.24903, 0.20843, 0.14143,
		0.00031, -0.00234,
		-0.42643, -2.02084, 1.58848, -1.57963,
		0.68418, 2.07749,
		-0.45888, 0.19859, -0.30277, -0.22591,
		0.11607, -0.09705,
		0.00040, 0.00431,
		-0.02683, 0.03158, -0.01302, -0.00541,
		0.01742, -0.00006,
		-0.02231, -0.01128,
		-0.00800, 0.02055,
		-0.00346, 0.00151,
		0.56732, -0.68995, 0.27701, -0.16748,
		0.01002, 0.00043,
		0.26916, -0.57751, 0.15547, -0.15825,
		-0.02074, -0.07722,
		-8.23483, -4.02022, 0.69327, -5.91543,
		1.72440, 1.02090,
		0.00024, -0.00053,
		20.03959, 14.79136, 76.43531, -14.42019,
		-7.82608, -69.96121, -54.94229, 23.55140,
		26.60767, 14.68275,
		0.05118, -0.10401, -0.00075, -0.01942,
		-3.84266, -26.23442, 10.20395, -14.77139,
		3.40853, 2.07297, -0.53348, 0.40635,
		0.00716, -0.00189,
		0.12472, -0.02903, 0.02254, -0.00183,
		-0.00175, -0.01522, 0.00003, -0.00339,
		0.00383, -0.00168,
		0.01327, -0.03657,
		-0.08458, -0.00115, -0.03991, -0.02629,
		0.00243, -0.00505,
		0.33875, -0.16744, 0.05183, 0.01744,
		-0.24427, 0.15271,
		0.37550, -0.17378, 0.09198, -0.27966,
		-0.22160, 0.16426,
		0.00032, -0.00310,
		-0.00022, -0.00144,
		-0.06170, -0.01195, -0.00918, 0.02538,
		0.03602, 0.03414,
		-0.14998, -0.44351, 0.45512, -0.11766,
		0.35638, 0.27539,
		5.93405, 10.55777, 12.42596, -1.82530,
		-2.36124, -6.04176, -0.98609, 1.67652,
		-0.09271, 0.03448, -0.01951, 0.00108,
		0.33862, 0.21461, 0.02564, 0.06924,
		0.01126, -0.01168, -0.00829, -0.00740,
		0.00106, -0.00854,
		-0.08404, 0.02508, -0.02722, -0.06537,
		0.01662, 0.11454, 0.06747, 0.00742,
		-0.01975, -0.02597,
		-0.00097, -0.01154, 0.00164, -0.00274,
		0.02954, -0.05161, -0.02162, -0.02069,
		-0.06369, 0.03846,
		0.00219, -0.01634, -0.04518, 0.06696,
		1.21537, 0.99500, 0.68376, -0.28709,
		-0.11397, -0.06468,
		0.00607, -0.00744, 0.01531, 0.00975,
		-0.03983, 0.02405, 0.07563, 0.00356,
		-0.00018, -0.00009,
		0.00172, -0.00331,
		0.01565, -0.03466, -0.00230, 0.00142,
		-0.00788, -0.01019,
		0.01411, -0.01456, -0.00672, -0.00543,
		0.00059, -0.00011,
		-0.00661, -0.00496, -0.01986, 0.01271,
		-0.01323, -0.00764, 0.00041, 0.01145,
		0.00378, -0.00137, 0.00652, 0.00412,
		0.01946, -0.00573,
		-0.00326, -0.00257,
		-0.00225, 0.00090,
		-0.00292, -0.00317, -0.00719, 0.00468,
		0.00245, 0.00189,
		0.00565, -0.00330,
		-0.00168, -0.00047,
		-0.00256, 0.00220,
		0.00180, -0.00162,
		-0.00085, -0.00003,
		-0.00100, 0.00098,
		-0.00043, 0.00007,
		-0.00003, -0.00013
	],
	rad_tbl: [
		-38127.94034, -48221.08524, -20986.93487, -3422.75861,
		-8.97362, 53.34259, -404.15708, -0.05434,
		0.46327, 0.16968,
		-387.16771, -146.07622, 103.77956, 19.11054,
		-40.21762, 996.16803, -702.22737, 246.36496,
		-63.89626, -304.82756, 78.23653, -2.58314,
		-0.11368, -0.06541,
		-0.34321, 0.33039,
		0.05652, -0.16493,
		67.44536, -29.43578, 50.85074, 18.68861,
		0.39742, 13.64587, -1.61284, 0.11482,
		0.01668, -0.01182,
		-0.00386, 0.01025,
		0.00234, -0.01530,
		-0.02569, -0.00799,
		-0.00429, -0.00217,
		-0.00672, 0.00650,
		0.01154, 0.00120, -0.00515, 0.00125,
		0.00236, -0.00216,
		-0.00098, 0.00009,
		-0.00460, -0.00518,
		0.00600, 0.00003,
		0.00834, 0.00095, 0.01967, 0.00637,
		-0.00558, -0.06911,
		-0.01344, -0.06589, -0.05425, -0.00607,
		-0.00247, -0.00266,
		0.08790, -0.08537, -0.00647, 0.04028,
		-0.00325, 0.00488,
		0.00111, -0.00044,
		-0.00731, 0.00127,
		-0.00417, 0.00303,
		0.05261, 0.01858,
		-0.00807, 0.01195,
		1.26352, -0.38591, -0.34825, 1.10733,
		-0.02815, -0.02148,
		-0.05083, -0.04377, -0.01206, -0.00586,
		0.03158, -0.01117, 0.00643, 0.00306,
		-0.01186, -0.05161, 0.01136, -0.00976,
		-0.00536, 0.01949,
		-1.41680, -0.81290, -0.09254, -0.24347,
		-0.14831, -0.34381,
		-2.44464, 0.41202, -0.99240, -0.33707,
		-0.01930, -0.08473,
		0.00830, 0.01165,
		-0.01604, -0.02439,
		0.00227, 0.04493,
		-42.75310, -22.65155, -9.93679, -18.36179,
		2.73773, 3.24126, -1.20698, 1.07731,
		0.00434, -0.10360,
		-0.02359, 0.00054,
		-0.02664, -0.00122,
		-19.79520, 33.11770, -53.56452, -35.41902,
		67.95039, -82.46551, 117.31843, 14.08609,
		0.06447, 0.03289,
		0.40365, -0.33397, 0.07079, -0.09504,
		-30.36873, 6.23538, -14.25988, -44.91408,
		38.53146, -16.31919, 6.99584, 22.47169,
		-0.13313, 0.28016,
		6.83715, -6.01384, 1.68531, -3.62443,
		-0.22469, -0.29718,
		0.25169, 0.13780,
		-3.64824, 1.22420, -2.48963, -1.12515,
		-0.01510, -0.56180,
		-0.03306, 0.01848, -0.00103, -0.00077,
		-0.01681, -0.00227,
		-0.00402, -0.00287,
		0.04965, -0.16190, -0.40025, 0.20734,
		0.15819, -0.25451,
		0.02467, -0.00495,
		0.00597, 0.00490,
		-0.01085, -0.00460,
		-0.71564, -0.26624, 0.03797, -0.28263,
		0.03510, 0.30014,
		2.79810, 0.07258,
		-0.01618, 0.00337,
		0.00876, 0.04438,
		0.00742, -0.00455,
		-0.01163, -0.00683,
		0.00950, 0.01275,
		-0.02124, -0.67527, -0.23635, 0.06298,
		-0.03844, 0.01010, 0.73588, -0.00271,
		0.01742, -0.00467,
		0.00017, -0.00505,
		-0.27482, 5.00521, -1.92099, 1.55295,
		-0.35919, -0.09314,
		-0.47002, 0.06826,
		0.07924, 0.16838,
		-0.04221, 0.71510, -0.16482, 0.08809,
		41.76829, -125.79427, 106.65271, -71.30642,
		36.18112, 17.36143, -1.63846, 5.02215,
		-1.08404, 0.00061,
		2.45567, -2.42818, -9.88756, 5.36587,
		-0.61253, -0.35003,
		1523.54790, 602.82184, 68.66902, 1878.26100,
		-1098.78095, -120.72600, 127.30918, -383.96064,
		-7.00838, -6.09942, -1.54187, 0.34883,
		-9.47561, -4.35408,
		-21541.63676, -32542.09807, -29720.82604, -28072.21231,
		-15755.56255, -8084.58657, -8148.87315, 7434.89857,
		11033.30133, 7827.94658, 610.18256, -11411.93624,
		-9.87426, 0.94865, -1.63656, 0.41275,
		1996.57150, 511.48468, 669.78228, 1363.67610,
		-379.72037, 198.84438, -16.63126, -79.37624,
		-2.30776, -246.07820, -16.85846, -148.18168,
		-6.89632, -20.49587, 0.39892, -0.34627,
		-57.81309, -136.96971, 15.25671, -96.61153,
		16.09785, -8.79091, 0.70515, 1.16197,
		0.05647, 0.04684,
		0.25032, -0.19951, 0.07282, -0.00696,
		0.00493, 0.00733,
		-0.01085, 0.00422,
		-0.01309, 0.00262,
		0.37616, -0.36203, -0.11154, 0.18213,
		0.15691, 0.29343, 0.00485, 0.06106,
		-0.01492, 0.09954,
		0.28486, 2.27190, 0.33102, 1.50696,
		-0.01926, 0.04901,
		0.01827, 0.00863,
		-0.03315, 0.00178,
		-0.77600, -0.48576, -0.21111, -0.19485,
		1.90295, 6.44856, 1.71638, 2.12980,
		-7.19585, -0.08043,
		0.07004, -0.02764,
		0.01604, 0.01158,
		0.00936, -0.01199,
		0.18396, -0.29234, 0.10422, -0.00720,
		0.05196, 0.10753, 0.02859, -0.03602,
		0.63828, 1.96280, -0.31919, 0.85859,
		-0.10218, -0.00673,
		0.01748, -0.02190,
		0.01266, -0.02729,
		-4.80220, 8.90557, -5.94059, 2.28577,
		-0.19687, -1.28666, 0.32398, 0.14879,
		-0.02619, -0.02056,
		-0.04872, -0.07011, -0.04082, -0.04740,
		0.60167, -2.20365, -0.27919, -0.45957,
		-1.31664, -2.22682, 176.89871, 13.03918,
		0.00568, 0.00560,
		0.01093, 0.00486,
		-0.00948, -0.31272,
		-11.87638, -3.68471, -1.74977, -9.60468,
		2.94988, -0.57118,
		0.00307, -0.01636,
		0.02624, 0.03032,
		-0.00464, -0.01338,
		0.00935, 0.00530,
		-0.11822, 0.03328, -0.41854, 0.04331,
		0.41340, -0.21657,
		-0.00865, 0.00849,
		-0.00374, -0.00899,
		0.01227, -0.23462, -0.71894, -0.04515,
		0.00047, 0.28112,
		-0.12788, 0.11698, -0.02030, 0.02759,
		0.02967, -0.00092,
		0.00454, 0.00565,
		-0.00026, 0.00164,
		-0.01405, -0.00862,
		0.01088, 0.05589,
		0.18248, -0.06931, -0.00011, 0.03713,
		0.01932, -0.00982,
		-0.13861, 0.09853, -0.03441, -0.02492,
		2.26163, -5.94453, 4.14361, -0.94105,
		0.39561, 0.75414,
		-0.17642, 0.03724,
		-1.32978, -0.56610,
		-0.03259, -0.06752,
		39.07495, 80.25429, -28.15558, 82.69851,
		-37.53894, -17.88963, 6.98299, -13.04691,
		-0.48675, -1.84530, -0.07985, -0.33004,
		-3.39292, 2.73153,
		-17268.46134, 1144.22336, -16658.48585, 5252.94094,
		-3461.47865, 2910.56452, -433.49442, -305.74268,
		-383.45023, 545.16136, 313.83376, 27.00533,
		-31.41075, 7.90570, -12.40592, 3.01833,
		-0.83334, 0.23404,
		59.26487, -112.74279, 113.29402, -15.37579,
		14.03282, 32.74482, -4.73299, 1.30224,
		-0.00866, 0.01232,
		-0.53797, 0.00238, -0.07979, 0.04443,
		-0.05617, -0.05396,
		0.10185, -1.05476, 0.43791, -0.32302,
		0.06465, 0.03815,
		0.00028, -0.00446,
		0.09289, -0.06389,
		0.01701, -0.01409,
		0.47101, 0.16158, 0.01036, -0.39836,
		0.00477, 0.01101,
		-2.06535, 0.33197, -0.82468, -0.41414,
		0.03209, -0.09348,
		0.00843, -0.00030,
		-9.49517, -3.82206, 0.66899, -10.28786,
		6.33435, 1.73684, -0.98164, 2.25164,
		-0.07577, -0.00277,
		1.02122, 0.75747, 1.79155, -0.77789,
		-2.56780, -2.07807,
		0.19528, 0.77118, -0.28083, 0.32130,
		-0.04350, -0.07428,
		-0.01161, 0.01387,
		0.02074, 0.19802, -0.03600, 0.04922,
		-0.19837, 0.02572,
		-0.00682, -0.04277,
		-0.01805, 0.00299,
		0.03283, -0.02099,
		3.57307, 1.17468, 0.65769, 1.88181,
		-0.39215, 0.08415,
		-0.53635, -0.19087, -0.12456, 0.02176,
		0.01182, -0.07941,
		-2.43731, 2.44464, 1.03961, -1.81936,
		30.33140, 0.92645,
		0.00508, -0.01771,
		-81.06338, 66.43957, 33.16729, 131.44697,
		76.63344, -34.34324, -35.33012, -28.04413,
		-1.47440, 13.09015,
		0.13253, -0.01629, 0.02187, -0.00963,
		-21.47470, -9.44332, -7.21711, -12.59472,
		1.76195, -1.63911, 0.09060, 0.28656,
		0.00635, 0.00536,
		0.03470, -0.06493, 0.00666, -0.01084,
		0.01116, -0.01612, -0.00102, 0.00208,
		-0.05568, 0.00628,
		0.02665, -0.01032,
		0.21261, -1.90651, 0.72728, -0.57788,
		0.08662, 0.10918,
		3.39133, 3.97302, -4.63381, 4.26670,
		-2.50873, -3.76064,
		1.28114, 1.81919, 1.48064, -0.37578,
		-0.26209, -0.47187,
		0.00282, -0.00499,
		0.01749, 0.03222,
		1.60521, -1.79705, 1.61453, 0.68886,
		-0.29909, 0.55025,
		-0.07894, 0.19880, -0.15635, 0.46159,
		2.09769, 1.52742,
		-7.60312, 11.34886, 4.35640, 8.61048,
		2.15001, -2.15303, -0.61587, -0.11950,
		-0.03289, -0.00520, -0.00501, -0.00445,
		0.15294, -0.05277, 0.02455, 0.00408,
		1.19601, 0.43479, 0.20422, 0.57125,
		-0.12790, 0.01318,
		-0.15275, -0.43856, 6.99144, -0.08794,
		-1.69865, 0.82589, -0.20235, 0.97040,
		0.20903, 0.00675,
		0.26943, 0.08281, 0.03686, 0.05311,
		1.28468, 1.21735, -1.38174, 1.29570,
		-0.75899, -1.17168,
		0.44696, -0.32341, -0.06378, -0.27573,
		-0.06406, 0.87186, 0.21069, 0.19724,
		0.00119, -0.04147,
		0.39279, 0.51437, -0.11035, 0.21450,
		-0.04309, 0.02359, 0.20490, 0.14210,
		0.00007, -0.00017,
		-0.03529, -0.02644,
		0.10710, 0.44476, -0.02632, -0.01817,
		2.11335, -0.04432,
		0.18206, 0.27335, 0.08867, 0.00313,
		-0.00692, 0.01595,
		-0.72957, 0.32080, -0.29291, -0.44764,
		0.12767, -0.05778, 0.04797, -0.00223,
		0.17661, 0.22427, -0.04914, 0.09114,
		0.12236, 0.00708,
		0.74315, -0.01346,
		0.02245, -0.02555,
		-0.30446, 0.13947, -0.12340, -0.18498,
		-0.04099, 0.02103,
		0.06337, -0.01224,
		0.28181, -0.01019,
		-0.02794, -0.09412,
		0.03272, -0.01095,
		0.11247, -0.00650,
		-0.01319, -0.04296,
		0.04653, -0.00423,
		0.06535, 0.00014
	],
	arg_tbl: [
		0, 7,
		3, 2, 5, -6, 6, 3, 7, 0,
		2, 2, 5, -5, 6, 5,
		3, 1, 6, -4, 7, 2, 8, 0,
		2, 1, 6, -3, 7, 0,
		3, 1, 6, -2, 7, -2, 8, 0,
		2, 4, 5, -10, 6, 3,
		3, 1, 5, -1, 6, -4, 7, 0,
		3, 2, 5, -4, 6, -3, 7, 0,
		3, 2, 6, -8, 7, 4, 8, 0,
		3, 3, 5, -10, 6, 7, 7, 0,
		2, 6, 5, -15, 6, 0,
		2, 2, 6, -6, 7, 0,
		3, 1, 5, -4, 6, 4, 7, 1,
		3, 1, 5, -2, 6, -1, 7, 0,
		3, 2, 5, -5, 6, 1, 8, 0,
		3, 3, 5, -8, 6, 2, 7, 0,
		3, 1, 5, -3, 6, 2, 8, 0,
		3, 1, 5, -3, 6, 1, 7, 1,
		1, 1, 8, 0,
		3, 1, 5, -3, 6, 2, 7, 1,
		3, 1, 5, -2, 6, -2, 7, 0,
		2, 2, 6, -5, 7, 1,
		3, 2, 6, -6, 7, 2, 8, 0,
		3, 2, 6, -7, 7, 4, 8, 0,
		3, 2, 5, -4, 6, -2, 7, 0,
		3, 1, 5, -1, 6, -5, 7, 0,
		3, 2, 6, -7, 7, 5, 8, 0,
		3, 1, 6, -1, 7, -2, 8, 0,
		2, 1, 6, -2, 7, 1,
		3, 1, 6, -3, 7, 2, 8, 0,
		3, 1, 6, -4, 7, 4, 8, 1,
		3, 2, 5, -5, 6, 2, 8, 1,
		3, 2, 5, -6, 6, 2, 7, 1,
		2, 2, 7, -2, 8, 0,
		1, 1, 7, 2,
		2, 5, 5, -12, 6, 2,
		3, 2, 6, -5, 7, 1, 8, 0,
		3, 1, 5, -1, 6, -3, 7, 0,
		3, 7, 5, -18, 6, 3, 7, 0,
		2, 3, 5, -7, 6, 3,
		3, 1, 6, 1, 7, -5, 8, 0,
		3, 1, 5, -4, 6, 3, 7, 0,
		3, 5, 5, -13, 6, 3, 7, 0,
		2, 1, 5, -2, 6, 3,
		3, 3, 5, -9, 6, 3, 7, 0,
		3, 3, 5, -8, 6, 3, 7, 1,
		2, 1, 5, -3, 6, 3,
		3, 5, 5, -14, 6, 3, 7, 0,
		3, 1, 5, -3, 6, 3, 7, 2,
		2, 3, 6, -7, 7, 0,
		2, 3, 5, -8, 6, 2,
		3, 2, 5, -3, 6, -4, 7, 1,
		3, 2, 5, -8, 6, 7, 7, 0,
		2, 5, 5, -13, 6, 0,
		2, 2, 6, -4, 7, 2,
		3, 2, 6, -5, 7, 2, 8, 0,
		3, 2, 5, -4, 6, -1, 7, 0,
		3, 2, 5, -7, 6, 4, 7, 0,
		2, 1, 6, -2, 8, 2,
		2, 1, 6, -1, 7, 0,
		3, 1, 6, -2, 7, 2, 8, 0,
		3, 2, 5, -5, 6, 2, 7, 0,
		3, 2, 5, -6, 6, 2, 8, 0,
		3, 2, 5, -6, 6, 1, 7, 0,
		2, 3, 7, -2, 8, 0,
		1, 2, 7, 1,
		2, 1, 6, -1, 8, 1,
		3, 1, 5, -2, 6, 1, 7, 0,
		3, 1, 5, -2, 6, 2, 8, 0,
		2, 3, 6, -6, 7, 2,
		2, 6, 5, -14, 6, 0,
		3, 3, 6, -7, 7, 2, 8, 0,
		3, 2, 5, -3, 6, -3, 7, 1,
		2, 4, 5, -9, 6, 3,
		3, 2, 6, -2, 7, -2, 8, 0,
		2, 2, 6, -3, 7, 1,
		3, 2, 6, -4, 7, 2, 8, 0,
		2, 2, 5, -4, 6, 3,
		3, 2, 5, -7, 6, 3, 7, 1,
		3, 1, 6, 1, 7, -2, 8, 0,
		1, 1, 6, 5,
		3, 2, 5, -5, 6, 3, 7, 1,
		2, 2, 5, -6, 6, 3,
		1, 3, 7, 3,
		2, 4, 5, -11, 6, 3,
		2, 1, 5, -4, 7, 0,
		3, 2, 5, -5, 6, -3, 7, 1,
		2, 6, 5, -16, 6, 0,
		3, 3, 5, -7, 6, 2, 7, 0,
		3, 3, 6, -4, 7, -2, 8, 0,
		2, 3, 6, -5, 7, 1,
		3, 3, 6, -6, 7, 2, 8, 1,
		3, 3, 6, -7, 7, 4, 8, 0,
		3, 2, 5, -3, 6, -2, 7, 2,
		3, 2, 5, -8, 6, 5, 7, 0,
		2, 2, 6, -4, 8, 0,
		3, 2, 6, -1, 7, -2, 8, 1,
		2, 2, 6, -2, 7, 2,
		3, 2, 6, -3, 7, 2, 8, 0,
		3, 2, 5, -4, 6, 1, 7, 0,
		3, 2, 5, -4, 6, 2, 8, 0,
		3, 2, 5, -7, 6, 2, 7, 1,
		2, 1, 6, 1, 7, 1,
		2, 5, 5, -11, 6, 2,
		3, 1, 5, -2, 7, -2, 8, 0,
		2, 1, 5, -3, 7, 0,
		2, 3, 5, -6, 6, 3,
		3, 2, 6, 1, 7, -5, 8, 0,
		2, 2, 6, -3, 8, 1,
		2, 1, 5, -1, 6, 3,
		3, 2, 5, -7, 6, 3, 8, 0,
		3, 3, 5, -7, 6, 3, 7, 0,
		3, 2, 5, -1, 6, -7, 7, 0,
		2, 1, 5, -4, 6, 2,
		3, 1, 5, -2, 6, 3, 7, 0,
		2, 4, 6, -7, 7, 0,
		2, 3, 5, -9, 6, 0,
		3, 2, 5, -2, 6, -4, 7, 0,
		2, 3, 6, -4, 7, 2,
		3, 2, 5, -3, 6, -1, 7, 0,
		3, 2, 5, -8, 6, 4, 7, 0,
		2, 2, 6, -2, 8, 1,
		2, 2, 6, -1, 7, 0,
		3, 2, 6, -2, 7, 2, 8, 1,
		3, 2, 5, -4, 6, 2, 7, 0,
		3, 2, 5, -7, 6, 2, 8, 0,
		3, 2, 5, -7, 6, 1, 7, 0,
		2, 1, 6, 2, 7, 0,
		2, 2, 6, -1, 8, 0,
		2, 4, 6, -6, 7, 1,
		2, 6, 5, -13, 6, 0,
		3, 2, 5, -2, 6, -3, 7, 1,
		2, 4, 5, -8, 6, 2,
		3, 3, 6, -2, 7, -2, 8, 0,
		2, 3, 6, -3, 7, 0,
		3, 3, 6, -4, 7, 2, 8, 0,
		2, 2, 5, -3, 6, 3,
		3, 2, 5, -8, 6, 3, 7, 1,
		3, 2, 6, 1, 7, -2, 8, 0,
		1, 2, 6, 5,
		3, 2, 5, -4, 6, 3, 7, 2,
		2, 2, 5, -7, 6, 3,
		3, 1, 6, 4, 7, -2, 8, 0,
		2, 1, 6, 3, 7, 1,
		3, 1, 6, 2, 7, 2, 8, 0,
		2, 4, 5, -12, 6, 2,
		2, 5, 6, -8, 7, 0,
		2, 4, 6, -5, 7, 0,
		3, 2, 5, -2, 6, -2, 7, 0,
		2, 3, 6, -2, 7, 1,
		3, 3, 6, -3, 7, 2, 8, 0,
		2, 5, 5, -10, 6, 2,
		3, 1, 5, 1, 6, -3, 7, 0,
		2, 3, 5, -5, 6, 3,
		2, 3, 6, -3, 8, 0,
		1, 1, 5, 2,
		2, 1, 5, -5, 6, 2,
		2, 5, 6, -7, 7, 0,
		2, 4, 6, -4, 7, 2,
		2, 3, 6, -2, 8, 0,
		2, 3, 6, -1, 7, 0,
		2, 5, 6, -6, 7, 0,
		2, 4, 5, -7, 6, 2,
		2, 4, 6, -3, 7, 2,
		2, 2, 5, -2, 6, 2,
		3, 2, 6, -9, 7, 3, 8, 0,
		1, 3, 6, 4,
		3, 2, 5, -3, 6, 3, 7, 1,
		2, 2, 5, -8, 6, 3,
		3, 2, 6, 4, 7, -2, 8, 0,
		2, 4, 5, -13, 6, 1,
		2, 6, 6, -8, 7, 1,
		2, 5, 6, -5, 7, 0,
		2, 4, 6, -2, 7, 0,
		2, 5, 5, -9, 6, 2,
		2, 3, 5, -4, 6, 2,
		2, 1, 5, 1, 6, 2,
		2, 6, 5, -11, 6, 0,
		3, 6, 6, -7, 7, 2, 8, 0,
		2, 4, 5, -6, 6, 2,
		2, 2, 5, -1, 6, 2,
		1, 4, 6, 3,
		3, 2, 5, -2, 6, 3, 7, 1,
		2, 2, 5, -9, 6, 1,
		2, 5, 5, -8, 6, 2,
		2, 3, 5, -3, 6, 1,
		2, 1, 5, 2, 6, 2,
		2, 6, 5, -10, 6, 1,
		2, 4, 5, -5, 6, 2,
		1, 2, 5, 1,
		1, 5, 6, 2,
		2, 5, 5, -7, 6, 1,
		2, 3, 5, -2, 6, 1,
		3, 1, 5, 2, 6, 3, 7, 0,
		2, 6, 5, -9, 6, 0,
		2, 4, 5, -4, 6, 2,
		2, 2, 5, 1, 6, 1,
		2, 7, 5, -11, 6, 0,
		2, 5, 5, -6, 6, 1,
		2, 3, 5, -1, 6, 1,
		2, 6, 5, -8, 6, 1,
		2, 4, 5, -3, 6, 0,
		2, 5, 5, -5, 6, 0,
		1, 3, 5, 0,
		2, 6, 5, -7, 6, 1,
		2, 7, 5, -9, 6, 0,
		2, 5, 5, -4, 6, 0,
		2, 6, 5, -6, 6, 0,
		2, 7, 5, -8, 6, 0,
		2, 6, 5, -5, 6, 0,
		2, 7, 5, -7, 6, 0,
		2, 8, 5, -9, 6, 0,
		2, 8, 5, -8, 6, 0,
		2, 1, 3, -1, 6, 0,
		-1
	]
};

// uranus.js
$ns.uranus = {
	maxargs: 9,
	max_harmonic: [0, 0, 0, 0, 5, 10, 9, 12, 0],
	max_power_of_t: 6,
	distance: 1.9218446061800002e+01,
	timescale: 3652500.0,
	trunclvl: 1.0,
	lon_tbl: [
		21.56000, -4652.06828, 154246324.90417, 1130486.05080,
		330.11531, -3020.20235,
		-8.03769, -122.02019,
		212.45130, 254.23866, 25.39758, 60.08296,
		6949.85053, 51951.42606, -1834.66531, 44481.91144,
		-3267.45825, 10776.65972, -628.05388, 532.83011,
		-16.80583, -30.05544,
		1420.33767, 2007.21040, 592.32842, 1541.61732,
		-163.55984, 121.14134, 114.74969, -16.04944,
		0.06069, 0.00725,
		-0.16861, 0.28785,
		0.07399, -0.09680,
		0.19936, -0.41620,
		0.02922, 0.07398,
		0.17272, 0.05602,
		1.65461, -0.68278, -2.18745, -0.85327,
		0.52467, -0.30863,
		0.01598, 0.30017,
		-0.04190, -0.03288,
		-0.02013, 0.02257,
		-0.54883, -0.22701, -0.09257, -0.03921,
		0.02644, 0.04667,
		0.24773, -0.16562,
		44242.85814, -223163.54065, 123776.84417, -206375.74884,
		70472.73820, -27456.55173, 4065.74401, 13202.39154,
		-3260.72648, 802.50579, -153.13236, -503.81026,
		30.17812, -31.91893,
		-65.14719, 77.78417, -37.38185, 19.13337,
		-3.14043, -0.21147,
		0.27143, 0.17424,
		0.04458, 0.10976,
		-0.41841, -0.21887, -0.09194, -0.02303,
		0.02896, 0.10044,
		0.01385, 0.01723,
		-0.01126, -0.09318,
		-57.95890, 29.69059, -46.41390, 3.07177,
		0.42494, 2.33678, -3.09621, 0.05256,
		-0.02134, -0.35202,
		-0.44475, -0.83135,
		1318.18265, 25605.86848, -9168.38371, 18917.31507,
		-5145.74480, 2130.77612, -485.25920, -438.44867,
		19.97802, -33.14800,
		-23383.91826, -45133.19122, -18520.80729, -26549.95198,
		-2276.70124, -2974.01604, 603.23665, 306.87616,
		-87.73070, -32.49134,
		549975.14525, 261920.31896, 526261.09735, 362619.26839,
		150616.68873, 164643.90808, 9550.02662, 27381.83042,
		-1065.89047, 1024.20231, -66.63822, -44.75169,
		-92.10532, -20.26930,
		-313205.95341, 1462242.64616, 112982.53079, 1865690.41965,
		308844.30901, 639864.93227, 89716.32843, 10378.80773,
		4395.08428, -14565.35913, -3016.07754, -19348.64612,
		3838.36899, -9813.42713, 6883.58821, -6064.92588,
		2740.47455, -176.29547, 241.91895, 268.44181,
		-6.13397, 17.92503,
		-0.01377, -0.08742,
		387.51915, 257.03872, 152.81792, 221.56197,
		-22.94836, 29.56640, -2.27801, 4.72805,
		-6.03420, -0.36763,
		0.00667, 0.00443,
		-0.01405, 0.04658,
		-0.06533, -0.01966,
		0.10738, 0.00443,
		0.02889, 0.01056,
		0.00900, -0.02206,
		0.00013, 0.05281,
		0.03035, 0.34793,
		0.19460, 2.47360,
		0.18189, -0.83895, 0.24983, 15.32050,
		0.46010, 2.79643,
		-0.45793, 0.96707, -0.31226, 0.51911,
		0.04071, 0.39399,
		0.00038, 0.03854,
		0.22446, 0.13630, -0.04357, 0.03635,
		0.00202, -0.04502,
		-0.00458, -0.03884,
		1.32597, 3.40849, -1.67839, -0.95411,
		-1.00116, -0.72744, -0.22484, -0.27682,
		-0.18069, 0.00405,
		-0.01000, 0.27523,
		-0.07038, -0.01051,
		-0.09064, 0.08518,
		0.02083, -0.25406,
		0.17745, -0.00944,
		0.21326, 0.20454,
		18.84894, -7.64400, 0.62670, -11.02728,
		8.91329, 20.67190,
		0.17757, -0.15471,
		-0.11385, -0.46057,
		6.23014, -14.46025, 2.30012, -2.22677,
		5.16823, -1.64235,
		-274.58413, 833.33247, -191.26241, 269.90157,
		-17.25965, 9.11368,
		-261.65136, -18274.45858, -2553.83872, -10039.10490,
		-508.52567, 336.18172, 14.88587, 421.35954,
		162.43462, 544.92580,
		-0.44246, 0.23216,
		-0.29024, -0.13057,
		-1.58438, 0.34032, -0.31604, -0.01166,
		-0.07112, 0.05721,
		-0.10813, 0.01064,
		-0.05413, 0.06705,
		-0.41582, -0.47725, 0.31031, 0.08605,
		0.00409, 0.02373,
		0.08092, 0.06247, -0.01026, 0.05863,
		-0.00238, 0.02948,
		0.00117, 0.02714,
		0.01720, 0.18261,
		-0.04067, 0.88639,
		-0.15502, -0.96383,
		-0.05307, -0.17319,
		-0.00486, -0.02373,
		-0.14748, -0.11884, 0.07798, -0.00358,
		0.01104, 0.00805,
		0.15099, -0.03453, 0.01846, 0.03459,
		0.02197, 0.07012,
		-0.43677, -1.87445, 1.35202, 2.28294,
		-0.03592, 0.07679,
		0.16427, 0.03014, 0.02472, 0.05549,
		-0.04985, 0.05874,
		0.35361, 0.01144, -0.57400, 1.34898,
		0.00265, 0.01540,
		0.00951, 0.08159,
		-0.00435, 0.34759,
		-0.12413, -0.49848,
		-0.77075, -2.73810,
		-31.77702, 12.16042, -14.87605, 11.98287,
		12.69358, 1.31307, -8.22911, -21.47437,
		-0.24051, -0.38332,
		-0.01162, -0.03175,
		0.00556, 0.02454,
		-0.02297, -0.01654,
		0.00707, 0.04828,
		-0.00309, 0.17381,
		-0.00500, -0.07579,
		0.02008, 0.05356,
		0.00702, 0.01133,
		-0.00237, -0.00612,
		0.18551, 0.22799, -0.14194, -0.08593,
		0.00002, -0.01049,
		-0.17363, -0.13986, 0.00078, -0.06993,
		-0.00430, -0.07795,
		-0.03232, -4.13170,
		0.00311, 0.05356,
		-0.17324, -0.15505, -0.00590, -0.06608,
		0.04257, -0.04571,
		0.00501, 0.02141,
		-0.00037, 0.07845,
		-0.00381, -0.03417,
		0.01834, 0.03349,
		0.07994, 0.15297,
		-0.82299, 0.24672, 0.51764, 0.96379,
		0.01729, 0.02489,
		-0.08581, 0.13252,
		0.00538, 0.01995,
		-0.00148, -0.02261,
		0.00534, 0.01565,
		-0.07518, -0.28114, 0.22386, 0.39023,
		-0.00864, 0.00964,
		-0.01923, -0.02426,
		-0.00112, 0.00923,
		-0.00685, 0.02450,
		0.26733, -0.99972, -0.82005, 0.13725,
		0.01520, -0.00790,
		0.00358, 0.00751,
		-0.00648, -0.00605,
		-0.04966, -0.04633,
		0.06394, -0.01965,
		0.50185, 0.40553, -0.25809, 0.28853,
		0.52545, -3.41675,
		-0.00347, -0.11848,
		0.02945, -0.01061,
		-0.04160, -0.03519,
		-0.03234, -0.81852,
		-0.02156, -0.00841,
		0.00029, 0.00020,
		-0.02281, -0.00364,
		0.04738, -0.04504,
		-0.19161, 0.37225, 0.05765, 0.11987,
		0.00050, 0.02012,
		-0.03806, 0.39498,
		0.29982, 0.00886, 0.01671, 53.04042,
		-0.04160, -0.38856,
		-0.00174, -0.01773,
		-0.47661, -0.32010, -0.01088, -0.16231,
		-0.01584, -0.00144,
		0.06659, 0.12734,
		0.04884, 0.02236,
		0.00146, 0.06030,
		-0.20660, -0.03982, 0.15091, 1.24562,
		-0.01303, -0.22426,
		-0.01518, -0.03922,
		-0.00043, -0.00047,
		0.02451, 0.04437,
		0.02380, -0.00189,
		-0.00640, -0.07114,
		-0.00320, -0.02491,
		-0.00829, 0.07284,
		0.02846, -0.28034,
		-0.00268, 0.00256,
		-0.43420, 0.39645, -0.31053, 1.25916,
		-0.00371, -0.00651,
		-0.00096, 0.02762,
		-0.00067, -0.02503,
		-0.01517, 0.03748
	],
	lat_tbl: [
		0.00000, 107.91527, 83.39404, -124.29804,
		-7.73277, -3.99442,
		-0.08328, -1.74251,
		-9.05659, -22.88559, -2.30655, -4.40259,
		-470.94604, -3648.43408, 326.28960, -2972.91303,
		337.37285, -650.33570, 57.18479, -18.29130,
		1.13897, 2.70158,
		-13.64388, -71.88619, 7.36408, -43.79994,
		6.57463, -5.81111, -0.06451, 0.73379,
		0.00574, -0.01635,
		0.00074, -0.01496,
		-0.00418, 0.00647,
		-0.00407, 0.00548,
		0.00002, 0.00187,
		-0.00591, 0.00557,
		0.32568, -0.01574, 0.19347, -0.01705,
		0.00173, 0.02384,
		-0.00248, -0.00103,
		0.00227, 0.00146,
		0.00307, -0.00040,
		0.03886, 0.01987, 0.00546, 0.00345,
		0.00134, -0.00609,
		-0.01502, -0.01569,
		-10080.59325, 10806.67752, -14013.76861, 9928.38683,
		-6540.83480, 2084.91597, -1093.05006, -305.34266,
		-9.04558, -110.32310, 9.26094, -3.93195,
		0.25552, 0.50327,
		-13.12170, -4.19317, -4.50857, -3.37626,
		-0.26850, -0.36028,
		-0.00357, 0.05862,
		-0.00828, 0.00926,
		-0.01515, -0.03687, -0.00224, -0.00802,
		-0.00225, -0.00158,
		-0.00022, -0.00044,
		-0.00281, 0.00371,
		2.28259, -4.29888, 1.74622, -2.13604,
		0.37023, -0.37022, 0.00886, 0.07081,
		0.01669, 0.00056,
		-0.02020, 0.01586,
		-4255.31929, 5978.03267, -7264.48027, 1884.12585,
		-2353.93882, -1593.23001, 17.57205, -498.54139,
		33.28704, -13.79498,
		-38416.64883, -13774.09664, -32822.03952, -3983.42726,
		-7538.09822, 1906.66915, -221.24439, 512.77046,
		32.26101, 12.46483,
		142710.47871, -96584.83892, 145395.05981, -86630.96423,
		48202.96749, -23596.77676, 5286.16967, -1626.44031,
		-16.53568, 95.15428, -15.19472, 5.69207,
		-6.72181, 7.28683,
		9515.16142, -166495.49381, 5588.84271, -146260.29445,
		2023.55881, -30687.22422, 243.64741, 971.58076,
		390.73247, -236.13754, -2684.56349, 739.81087,
		-597.39429, 474.89313, -631.69166, 213.04947,
		-204.89515, -33.09139, -17.78004, -22.21866,
		0.61083, -1.41177,
		-0.00070, -0.00501,
		-58.24552, 25.27978, -36.39386, 0.36376,
		-2.21030, -6.46685, -0.58473, -0.09357,
		0.12829, -0.94855,
		0.00042, 0.00048,
		0.00411, 0.00101,
		0.00249, -0.00865,
		0.00223, 0.00293,
		0.00041, -0.00042,
		0.00104, -0.00086,
		0.00126, -0.00380,
		0.00906, -0.02253,
		0.05998, -0.10318,
		0.00004, -0.03225, 0.14303, -0.05273,
		0.32683, 0.09386,
		-0.17053, 0.60847, -0.06190, 0.28166,
		0.06411, 0.05289,
		0.01138, 0.00128,
		-0.00930, 0.00272, 0.00037, 0.00215,
		0.00004, 0.00050,
		0.00114, -0.00217,
		0.05358, -0.06413, -0.00124, 0.03842,
		0.01006, 0.22479, 0.00412, 0.04040,
		0.01708, 0.02164,
		0.02484, -0.02463,
		-0.00103, 0.02633,
		-0.01303, -0.03214,
		0.03613, 0.02205,
		-0.02677, -0.02522,
		-0.00293, 0.03130,
		-1.87255, -2.50308, -1.53715, 0.36859,
		-0.17829, -1.12095,
		-0.05652, -0.00786,
		-0.06992, 0.07279,
		-2.95896, 0.55138, -0.61498, -0.11008,
		-0.87790, -0.50965,
		119.73553, -35.18217, 44.78683, -4.22438,
		1.95723, 0.58033,
		-4077.02379, -353.39110, -2781.63273, -75.23318,
		-312.50478, -23.86495, 24.59887, 32.56837,
		120.09593, -51.00495,
		0.09737, 0.09111,
		0.04799, -0.05029,
		0.08351, -0.33726, 0.03158, -0.06435,
		-0.00523, -0.01736,
		0.00751, -0.01757,
		-0.00406, -0.01198,
		0.16402, -0.10986, -0.02024, 0.07205,
		-0.00440, -0.00072,
		-0.00465, 0.00310, -0.00121, -0.00121,
		0.00083, 0.00020,
		0.00140, -0.00176,
		0.00381, -0.00731,
		-0.01618, 0.01570,
		-0.10201, 0.05809,
		-0.03359, 0.01024,
		-0.00535, 0.00018,
		0.00024, 0.00509, -0.00158, -0.00466,
		0.00009, -0.00083,
		-0.00700, -0.00090, -0.00011, -0.00079,
		0.00133, -0.00126,
		0.01416, 0.05553, 0.04283, -0.06719,
		0.00119, 0.00291,
		-0.00263, 0.01282, -0.00040, 0.00188,
		-0.00237, 0.00973,
		-0.39533, 0.18773, -0.79821, -0.40168,
		0.00151, -0.00161,
		0.00123, -0.00516,
		-0.01432, -0.00293,
		-0.05477, 0.04130,
		-0.48837, 0.18944,
		-0.12552, 9.37098, 1.02045, 5.11382,
		0.72098, -3.70049, -5.80982, 3.30105,
		-0.09682, 0.09696,
		-0.00876, 0.00504,
		0.00318, 0.00245,
		0.00563, -0.00665,
		0.00108, -0.00233,
		-0.00117, 0.00177,
		-0.00343, 0.00503,
		0.01044, -0.00651,
		0.00296, -0.00162,
		0.00037, 0.00028,
		-0.00020, -0.00786, 0.00029, 0.00836,
		0.00004, 0.00033,
		-0.00309, -0.00086, -0.00157, -0.00086,
		-0.00058, 0.00105,
		-0.04557, 0.01794,
		-0.00122, -0.00086,
		0.00420, -0.00285, 0.00118, -0.00020,
		0.00743, -0.01217,
		0.00053, -0.00084,
		-0.00075, 0.00097,
		-0.00107, 0.00314,
		0.00576, -0.00505,
		0.03624, -0.02546,
		0.05379, 0.30081, 0.29870, -0.22106,
		0.00696, -0.00801,
		-0.03995, -0.01808,
		-0.00139, 0.00102,
		-0.00059, 0.00138,
		0.00019, -0.00037,
		0.00274, 0.00658, 0.00672, -0.01132,
		0.00023, 0.00051,
		0.00031, 0.00090,
		-0.00017, -0.00001,
		0.00085, 0.00004,
		0.02221, -0.01977, 0.07498, 0.03025,
		-0.00082, -0.00022,
		-0.00073, -0.00028,
		-0.00253, 0.00259,
		-0.01329, 0.01805,
		0.00096, 0.00833,
		-0.11836, 0.04277, -0.10820, -0.03018,
		0.34504, 0.09834,
		-0.00538, -0.00231,
		0.00036, 0.00042,
		-0.00023, 0.00260,
		-0.01137, 0.00036,
		0.01081, -0.03271,
		-0.00029, -0.00028,
		0.00018, -0.00003,
		0.00009, 0.00012,
		0.00127, 0.00343, 0.00100, -0.00064,
		0.00014, 0.00004,
		0.00150, 0.00069,
		-0.01484, 0.00135, 0.03930, 0.01405,
		0.00064, 0.00029,
		0.00009, 0.00009,
		0.00054, -0.00048, 0.00019, 0.00005,
		-0.00009, 0.00018,
		0.00192, -0.00333,
		0.01824, 0.01071,
		0.00107, -0.00341,
		0.25530, -0.18414, -0.84151, -0.31475,
		-0.00400, -0.00010,
		-0.00174, 0.00019,
		0.00006, -0.00079,
		0.00066, -0.00070,
		0.00599, 0.00330,
		-0.00160, -0.00013,
		-0.00067, -0.00006,
		-0.00176, -0.00111,
		0.00652, 0.00368,
		0.00004, 0.00001,
		-0.00081, 0.00089, 0.00366, 0.00139,
		0.00002, 0.00001,
		-0.01870, -0.00998,
		-0.00020, -0.00007,
		0.00005, 0.00003
	],
	rad_tbl: [
		0.00000, -53.23277, -44.70609, -62.54432,
		-19.15218, 0.10867,
		-1.91911, 1.47517,
		16.51994, 5.00458, 3.88980, 1.55740,
		3598.17109, 1831.07574, 2633.34851, 1775.69482,
		497.10486, 488.77343, 6.03892, 31.08365,
		-2.06585, -1.12599,
		230.37762, -113.95449, 162.40244, -46.57185,
		6.70207, 17.27241, -0.66092, -14.42065,
		-0.01044, -0.00287,
		-0.03894, -0.01663,
		0.01629, 0.00496,
		0.08411, 0.02855,
		0.01795, -0.00695,
		0.02426, -0.03921,
		-0.24495, -0.77369, -0.31404, 0.38668,
		-0.05682, -0.17197,
		0.06145, -0.00510,
		0.00606, -0.00886,
		-0.00370, -0.00588,
		0.02173, -0.11909, 0.00302, -0.01796,
		-0.01067, 0.00990,
		0.05283, 0.06517,
		59710.89716, -491.12783, 58672.38609, 19564.41947,
		10597.99050, 14313.02561, -2585.52040, 766.78396,
		-138.39893, -802.43403, 131.35006, -31.97561,
		7.95978, 8.16075,
		28.72669, 31.72473, 6.45792, 16.50701,
		0.01066, 1.29718,
		0.11565, -0.13240,
		0.05110, -0.01543,
		-0.09994, 0.18864, -0.01330, 0.04148,
		0.03510, -0.00366,
		0.00604, -0.00604,
		0.03752, -0.00256,
		-7.00488, -21.63748, 1.43064, -17.10914,
		-0.62987, 0.48719, 0.00697, -1.22665,
		-0.14435, -0.00550,
		0.32008, -0.19855,
		-13976.73731, -3559.49432, -7709.90803, -9310.80334,
		749.31835, -3491.50696, 540.94979, -84.57550,
		16.96663, 35.53930,
		37214.64771, -36361.15845, 21093.74492, -31855.33076,
		1500.84653, -7031.97901, -453.40865, -18.36692,
		-2.07726, -17.92336,
		-56348.30507, 378512.71483, -111444.43340, 370543.95160,
		-61893.70301, 112131.05507, -11977.44617, 9156.15245,
		-567.61838, -495.25760, 16.96202, -44.06279,
		4.24760, -48.83674,
		-643705.49516, -131013.09649, -838580.02217, 67627.11556,
		-288441.70339, 150227.25291, -2500.57537, 42676.19888,
		7084.60505, 2043.65642, 9639.56835, -1502.03390,
		-4126.00409, -828.73564, -2801.35204, -2293.77751,
		-209.23365, -1045.31476, 95.57334, -102.74623,
		7.19216, 1.89593,
		-0.05661, 0.02166,
		120.38332, -141.16507, 98.31386, -40.23448,
		10.84269, 17.57713, 1.69239, 1.45065,
		-0.19626, 2.76108,
		-0.00270, 0.00360,
		-0.02333, -0.00710,
		-0.01035, 0.02950,
		0.00737, -0.06311,
		-0.00613, 0.01407,
		0.01377, 0.00879,
		-0.03287, 0.00012,
		-0.21667, 0.01793,
		-1.54865, 0.10953,
		0.54543, 0.12102, -9.48047, 0.11477,
		-1.34966, 0.23199,
		-1.50834, 0.26567, -0.64503, 0.10742,
		-0.21452, 0.04428,
		-0.01920, -0.00906,
		-0.09378, 0.12773, -0.02787, -0.03090,
		0.03111, 0.00140,
		0.03771, -0.01269,
		-1.94794, 1.22823, 0.64183, -1.11467,
		-0.19301, -0.27357, 0.05710, -0.08115,
		-0.07318, 0.00806,
		0.14286, 0.20297,
		0.14920, -0.07897,
		0.09682, 0.02379,
		-0.13928, 0.01679,
		-0.00774, 0.10060,
		0.24433, 0.16760,
		-2.88905, -1.61439, 2.83052, -3.41031,
		36.37048, 3.37867,
		0.29321, 0.09687,
		0.29324, -0.14651,
		8.11116, 1.79211, 1.36421, 0.88111,
		1.21683, 2.37950,
		-357.76211, -87.84636, -117.55745, -67.18338,
		-5.26029, -6.27559,
		7509.94562, 3.68942, 4223.62097, -1041.13557,
		-74.64464, -251.41613, -166.22180, -1.68190,
		-214.55340, 62.79593,
		-0.08250, -0.15936,
		-0.03830, 0.10857,
		0.21368, 0.50812, 0.00869, 0.09832,
		0.02158, 0.02045,
		0.01407, 0.03591,
		0.03460, 0.01171,
		-0.16400, 0.09751, 0.03521, -0.12858,
		0.00700, -0.00524,
		0.01698, -0.04796, 0.04006, 0.00565,
		-0.02783, -0.00205,
		-0.02296, 0.00153,
		-0.16139, 0.01514,
		-0.78136, -0.01546,
		0.40374, -0.06014,
		0.06212, -0.01828,
		0.00831, -0.00173,
		0.06857, -0.11677, 0.00028, 0.05765,
		-0.00796, 0.00691,
		0.03764, 0.14902, -0.02653, 0.02122,
		-0.05503, 0.01549,
		1.56630, -0.35551, -1.87960, 1.14303,
		-0.06063, -0.03425,
		0.03367, -0.11969, 0.04485, -0.01651,
		0.04647, -0.02097,
		0.22841, 0.47362, 0.99226, -0.60660,
		-0.01249, 0.00134,
		-0.07435, 0.00722,
		-0.31796, -0.00015,
		0.20533, -0.04398,
		0.93944, -0.26710,
		-5.60051, -9.32918, -5.13538, -4.05130,
		-0.56529, 4.34112, 7.18308, -2.66103,
		0.13241, -0.07999,
		0.01046, -0.00535,
		-0.04037, -0.00455,
		-0.00510, 0.00731,
		-0.04576, 0.00513,
		-0.15846, -0.00236,
		0.04628, -0.00463,
		-0.01585, 0.00585,
		-0.00213, 0.00283,
		0.00778, -0.00198,
		-0.17803, 0.18321, 0.07702, -0.12325,
		0.01091, 0.00349,
		0.14211, -0.21830, 0.07289, -0.00994,
		0.07090, -0.00079,
		4.18441, -0.07413,
		-0.06247, -0.00011,
		-0.15453, 0.14499, -0.06557, -0.00098,
		0.00290, 0.02921,
		-0.01923, 0.00457,
		-0.07538, -0.00120,
		0.02263, -0.00037,
		-0.01061, 0.00591,
		-0.04725, 0.02364,
		-0.07460, -0.24108, -0.28310, 0.14643,
		-0.00700, 0.00427,
		0.22963, 0.03713,
		-0.02062, 0.00478,
		0.01434, 0.00095,
		-0.01425, 0.00376,
		0.29611, -0.08038, -0.37811, 0.21703,
		-0.00723, -0.00924,
		-0.02736, 0.01814,
		0.00934, 0.00731,
		0.00613, 0.00686,
		-0.91503, -0.32009, -0.15505, 0.79589,
		-0.00555, -0.01536,
		-0.00698, 0.00480,
		0.00373, -0.00046,
		0.00715, -0.00470,
		-0.01970, -0.05238,
		0.60649, -0.32669, 0.17790, 0.33383,
		-2.74922, -0.25827,
		-0.07862, 0.00406,
		-0.00948, -0.02117,
		0.03127, -0.04199,
		0.89670, -0.02413,
		0.01954, 0.03990,
		0.00063, -0.00071,
		-0.00226, 0.02009,
		-0.04407, -0.05069,
		0.38230, 0.16101, 0.11893, -0.06125,
		0.02051, -0.00046,
		0.39211, 0.03679,
		0.01666, -0.31336, 53.28735, -0.01791,
		-0.39414, 0.04181,
		-0.01885, 0.00165,
		0.31349, -0.47359, 0.16133, -0.01023,
		0.00007, 0.01758,
		-0.13351, 0.07249,
		0.00977, 0.05445,
		0.11650, -0.00191,
		-0.09824, 0.40106, 2.41155, -0.30655,
		0.24975, -0.01248,
		-0.03688, 0.01097,
		0.00038, -0.00051,
		-0.04736, 0.02610,
		0.00968, 0.02634,
		0.07918, -0.00606,
		0.02735, -0.00320,
		-0.07544, -0.00468,
		0.19996, -0.01964,
		0.00201, 0.00267,
		0.39562, 0.43289, 1.24743, 0.31084,
		-0.00666, 0.00377,
		0.05668, 0.00148,
		0.03220, -0.00026,
		0.03717, 0.01509
	],
	arg_tbl: [
		0, 3,
		2, 1, 7, -2, 8, 0,
		2, 2, 7, -4, 8, 0,
		2, 3, 7, -6, 8, 1,
		2, 2, 5, -5, 6, 4,
		2, 1, 6, -3, 7, 3,
		3, 1, 6, -1, 7, -4, 8, 0,
		3, 2, 5, -7, 6, 6, 7, 0,
		3, 2, 6, -6, 7, 1, 8, 0,
		3, 2, 6, -7, 7, 3, 8, 0,
		3, 2, 6, -8, 7, 4, 8, 0,
		3, 2, 6, -7, 7, 2, 8, 0,
		2, 2, 6, -6, 7, 2,
		3, 1, 5, -4, 6, 4, 7, 0,
		3, 1, 6, -2, 7, -1, 8, 0,
		3, 1, 6, -3, 7, 1, 8, 0,
		3, 1, 6, -4, 7, 3, 8, 1,
		2, 5, 7, -9, 8, 0,
		2, 4, 7, -7, 8, 0,
		2, 2, 7, -3, 8, 6,
		2, 1, 7, -3, 8, 2,
		2, 2, 7, -5, 8, 0,
		2, 3, 7, -7, 8, 0,
		3, 1, 6, -6, 7, 5, 8, 1,
		3, 1, 6, -5, 7, 3, 8, 0,
		3, 2, 5, -8, 6, 8, 7, 0,
		3, 1, 5, -4, 6, 5, 7, 0,
		2, 2, 6, -5, 7, 3,
		3, 1, 6, 1, 7, -9, 8, 0,
		3, 2, 5, -4, 6, -2, 7, 0,
		2, 1, 6, -4, 8, 4,
		2, 1, 6, -2, 7, 4,
		2, 5, 7, -8, 8, 5,
		2, 3, 7, -4, 8, 0,
		1, 1, 7, 5,
		2, 2, 7, -6, 8, 4,
		3, 1, 6, -6, 7, 4, 8, 0,
		2, 1, 6, -4, 7, 4,
		3, 2, 6, -5, 7, 1, 8, 0,
		3, 2, 6, -6, 7, 3, 8, 0,
		2, 2, 6, -7, 7, 0,
		3, 1, 5, -4, 6, 3, 7, 0,
		3, 1, 6, -1, 7, -1, 8, 0,
		2, 1, 5, -2, 6, 0,
		2, 6, 7, -9, 8, 0,
		2, 5, 7, -7, 8, 0,
		2, 4, 7, -5, 8, 0,
		2, 3, 7, -3, 8, 1,
		2, 2, 7, -1, 8, 0,
		2, 1, 7, 1, 8, 2,
		1, 3, 8, 0,
		2, 3, 6, -7, 7, 1,
		3, 2, 5, -3, 6, -4, 7, 0,
		3, 2, 6, -3, 7, -2, 8, 0,
		2, 2, 6, -4, 7, 1,
		3, 2, 6, -5, 7, 2, 8, 1,
		3, 5, 5, -9, 6, -8, 7, 0,
		3, 2, 5, -4, 6, -1, 7, 0,
		3, 1, 6, 3, 7, -8, 8, 0,
		3, 2, 6, -8, 7, 1, 8, 0,
		3, 2, 5, -7, 6, 4, 7, 0,
		3, 4, 5, -10, 6, 2, 7, 0,
		2, 1, 6, -2, 8, 0,
		2, 1, 6, -1, 7, 2,
		2, 8, 7, -12, 8, 0,
		2, 7, 7, -10, 8, 0,
		2, 6, 7, -8, 8, 1,
		2, 5, 7, -6, 8, 0,
		2, 4, 7, -4, 8, 2,
		1, 2, 7, 4,
		1, 4, 8, 0,
		2, 1, 7, -6, 8, 0,
		2, 2, 7, -8, 8, 1,
		2, 3, 7, -10, 8, 0,
		2, 4, 7, -12, 8, 0,
		3, 1, 6, -6, 7, 2, 8, 0,
		2, 1, 6, -5, 7, 1,
		3, 1, 6, -4, 7, -2, 8, 0,
		3, 1, 5, -4, 6, 2, 7, 1,
		3, 1, 5, -2, 6, 1, 7, 0,
		2, 7, 7, -9, 8, 0,
		2, 6, 7, -7, 8, 0,
		2, 5, 7, -5, 8, 0,
		2, 4, 7, -3, 8, 0,
		2, 3, 7, -1, 8, 0,
		2, 2, 7, 1, 8, 0,
		2, 3, 6, -6, 7, 1,
		3, 3, 6, -7, 7, 2, 8, 0,
		3, 2, 5, -3, 6, -3, 7, 1,
		3, 2, 6, -2, 7, -2, 8, 0,
		2, 2, 6, -3, 7, 1,
		3, 2, 6, -4, 7, 2, 8, 0,
		3, 2, 5, -7, 6, 3, 7, 1,
		3, 1, 6, 1, 7, -2, 8, 0,
		1, 1, 6, 1,
		2, 8, 7, -10, 8, 0,
		2, 7, 7, -8, 8, 0,
		2, 6, 7, -6, 8, 0,
		2, 5, 7, -4, 8, 0,
		2, 4, 7, -2, 8, 0,
		1, 3, 7, 3,
		2, 2, 7, 2, 8, 0,
		2, 1, 7, 4, 8, 0,
		2, 1, 5, -4, 7, 0,
		2, 1, 6, -6, 7, 0,
		2, 8, 7, -9, 8, 0,
		2, 7, 7, -7, 8, 0,
		2, 6, 7, -5, 8, 0,
		2, 5, 7, -3, 8, 0,
		2, 4, 7, -1, 8, 0,
		3, 3, 6, -4, 7, -2, 8, 0,
		2, 3, 6, -5, 7, 1,
		3, 3, 6, -6, 7, 2, 8, 0,
		3, 2, 5, -3, 6, -2, 7, 1,
		3, 2, 6, -1, 7, -2, 8, 0,
		2, 2, 6, -2, 7, 0,
		3, 2, 6, -3, 7, 2, 8, 0,
		3, 2, 5, -7, 6, 2, 7, 1,
		2, 1, 6, 1, 7, 0,
		2, 9, 7, -10, 8, 0,
		2, 8, 7, -8, 8, 0,
		2, 7, 7, -6, 8, 0,
		2, 6, 7, -4, 8, 0,
		2, 5, 7, -2, 8, 0,
		1, 4, 7, 1,
		2, 3, 7, 2, 8, 0,
		2, 1, 5, -3, 7, 0,
		2, 9, 7, -9, 8, 0,
		2, 8, 7, -7, 8, 0,
		3, 3, 6, -3, 7, -2, 8, 0,
		2, 3, 6, -4, 7, 1,
		3, 3, 6, -5, 7, 2, 8, 0,
		3, 2, 5, -3, 6, -1, 7, 0,
		3, 2, 5, -8, 6, 4, 7, 0,
		2, 2, 6, -2, 8, 0,
		2, 2, 6, -1, 7, 1,
		3, 2, 6, -2, 7, 2, 8, 0,
		3, 2, 5, -7, 6, 1, 7, 0,
		2, 6, 7, -2, 8, 0,
		1, 5, 7, 0,
		3, 3, 6, -4, 7, 1, 8, 0,
		2, 1, 5, -2, 7, 2,
		3, 1, 5, -3, 7, 2, 8, 0,
		3, 1, 5, -1, 6, 1, 7, 0,
		2, 4, 6, -6, 7, 0,
		2, 3, 6, -3, 7, 0,
		1, 2, 6, 0,
		3, 2, 5, -4, 6, 3, 7, 0,
		3, 1, 5, 1, 6, -4, 7, 0,
		3, 3, 5, -5, 6, -1, 7, 0,
		1, 6, 7, 1,
		3, 1, 5, 1, 7, -4, 8, 0,
		2, 1, 5, -2, 8, 0,
		2, 1, 5, -1, 7, 1,
		3, 1, 5, -2, 7, 2, 8, 0,
		3, 1, 5, -3, 7, 4, 8, 0,
		3, 1, 5, -5, 6, 1, 7, 1,
		3, 1, 5, -1, 6, 2, 7, 0,
		2, 4, 6, -5, 7, 0,
		2, 3, 6, -2, 7, 0,
		3, 1, 5, 1, 7, -2, 8, 0,
		1, 1, 5, 1,
		2, 4, 6, -4, 7, 0,
		2, 3, 6, -1, 7, 0,
		3, 3, 5, -5, 6, 1, 7, 0,
		2, 5, 6, -6, 7, 0,
		2, 4, 6, -3, 7, 0,
		2, 5, 6, -5, 7, 0,
		2, 6, 6, -6, 7, 0,
		2, 2, 5, -3, 7, 0,
		2, 2, 5, -2, 7, 0,
		2, 2, 5, -2, 8, 0,
		2, 2, 5, -1, 7, 1,
		3, 2, 5, -2, 7, 2, 8, 0,
		1, 2, 5, 0,
		2, 3, 5, -3, 7, 0,
		2, 3, 5, -1, 7, 0,
		-1
	]
};

// neptune.js
$ns.neptune = {
	maxargs: 9,
	max_harmonic: [0, 0, 0, 0, 3, 8, 7, 9, 0],
	max_power_of_t: 3,
	distance: 3.0110386869399999e+01,
	timescale: 3652500.0,
	trunclvl: 1.0,
	lon_tbl: [
		-1376.86480, 730.38970, 78655362.50948, 1095691.38676,
		-196.19023, 2086.77782,
		-122.04650, -276.81592,
		184.56164, -148.08924,
		3.39142, -14.75027,
		-9.22741, 0.87688,
		-0.13903, -0.44707,
		-0.17668, -0.36299,
		-0.12682, -0.26636,
		-0.51426, -0.24667,
		-0.04965, -0.03177,
		0.05050, -0.00249,
		-0.80362, -0.07363, -0.15436, -0.07180,
		2.45034, -3.50145, 0.86698, 0.09777,
		7.72386, 7.16565, 2.10273, 8.86682,
		2.44705, 77.90155,
		0.28323, -11.87157, -13.64083, 252.70556,
		-4.94214, -6.17988, -305.60504, 51.23962,
		-2759.81719, 2476.20912,
		12.65762, 13.31543,
		0.36996, -0.19077, 0.67363, 0.36737,
		0.02312, 0.02216,
		0.09953, 0.04777,
		-0.00572, -0.02772,
		-0.02478, -0.21920,
		-0.15289, -1.50784,
		-0.17822, 0.34638, -0.70473, -8.61559,
		-2.65756, 1.25632,
		-0.31453, -1.40348, -4.02571, -1.50467,
		-69.62308, 3.21315,
		0.69973, 0.08832,
		-0.00551, -0.04964,
		-0.02264, -0.34881,
		0.00762, -1.85072,
		0.01407, -0.30457,
		-0.09851, -0.02372,
		-0.07729, -0.11602, -0.75995, -0.71884,
		-0.08585, -0.30406, 0.45818, 0.14921,
		-0.01033, -0.11776,
		0.00640, -0.57717,
		-0.01014, -0.01357, -0.00544, -0.02168,
		0.40468, 0.28195, 0.00668, 0.14448,
		0.01245, -0.08956,
		-0.26283, 0.01864, -0.00641, 18.55347,
		0.01460, 0.08284,
		-0.04785, 0.11360,
		-0.33861, 0.01327, -0.06392, -0.18758,
		0.05449, -0.05583,
		-0.00435, -0.09869,
		-0.00286, -0.04613,
		-0.00395, -0.14564,
		-0.01385, -0.01762,
		0.21160, -0.61631, -0.52100, -0.04583,
		0.32812, 0.32138,
		0.04749, -0.05724,
		0.11239, 0.13216,
		-0.01203, 0.40084, -0.05207, 34.07903,
		-0.21457, -0.34938, -0.04594, 0.11198,
		-0.30662, -0.20776, -0.01076, -0.10959,
		0.10891, -0.10304,
		-0.28141, 0.25061, -0.20293, 0.79930
	],
	lat_tbl: [
		-391.05987, -243.95958, -23.83558, 58.13857,
		5.04859, -3.93183,
		-14.21914, 7.14247,
		-12.09415, -9.70132,
		1.04307, 0.47323,
		-0.07504, 0.70575,
		-0.05239, 0.00482,
		-0.02916, 0.00877,
		-0.00528, -0.00286,
		0.00028, -0.00228,
		-0.00056, -0.00149,
		0.00049, 0.00047,
		-0.18765, -0.59571, 0.03742, -0.14653,
		2.30535, 0.65092, 0.42216, 0.24521,
		-2.86932, 2.37808, -0.58456, 0.27446,
		-1.12264, -2.04413,
		-11.71318, -1.41554, -23.30671, -24.70499,
		8.82738, 85.64657, -90.02223, 22.42604,
		-4749.41359, -4244.46820,
		25.20811, -18.51469,
		-1.19892, -0.61067, 0.67734, -1.08912,
		-0.01607, 0.00626,
		-0.00008, 0.00126,
		-0.00330, -0.00078,
		-0.01503, 0.00758,
		-0.13208, -0.00218,
		-0.04522, 0.20297, -0.94708, -0.77897,
		-2.74075, -3.01122,
		-1.03394, 0.00886, 1.55485, -4.68416,
		-0.13244, -57.26983,
		0.05589, -0.55396,
		-0.00130, 0.00526,
		-0.01028, 0.02086,
		0.01334, 0.00699,
		0.08565, 0.02020,
		0.01001, -0.08402,
		0.08558, -0.04488, 0.57268, -0.59574,
		0.00807, 0.00492, 0.21993, -0.18949,
		-0.00396, 0.00735,
		0.00487, 0.00230,
		0.00699, -0.00473, 0.01406, -0.00139,
		0.00738, 0.00099, 0.00161, 0.00019,
		-0.00067, -0.00047,
		0.00572, -0.00486, -0.00842, 0.00322,
		0.00018, -0.00109,
		-0.00272, 0.00112,
		-0.00041, 0.00763, 0.00211, 0.00118,
		-0.46842, -0.17877,
		0.00209, -0.00179,
		0.00090, -0.00075,
		0.00618, 0.00610,
		0.00015, 0.00032,
		-0.00123, 0.00026, 0.00332, 0.00135,
		0.39130, -0.34727,
		0.00015, -0.00027,
		-0.00026, -0.00052,
		0.00162, 0.00913, -0.00697, 0.00308,
		-0.00333, -0.00258, -0.00117, 0.00035,
		0.00766, 0.00194, 0.00135, 0.00067,
		-0.41171, 0.24241,
		0.00106, 0.00025, 0.00013, -0.00019
	],
	rad_tbl: [
		-767.68936, -460.59576, -52.41861, -273.85897,
		59.52489, 1.85006,
		-39.64750, 23.63348,
		-34.60399, -23.41681,
		2.74937, 1.55389,
		0.20343, 2.15502,
		-0.12846, 0.07199,
		-0.07555, 0.05582,
		-0.04354, 0.01546,
		-0.03931, 0.07623,
		-0.00491, 0.00661,
		0.00322, 0.01540,
		-0.06741, -0.35343, 0.00469, -0.08073,
		1.94975, 0.66376, 0.06137, 0.31426,
		-2.93841, 4.27732, -4.00342, 1.11157,
		-36.87785, 1.24960,
		4.69573, 2.15164, -114.24899, -6.69320,
		12.99919, -9.47795, -21.82350, -156.88624,
		-1237.19769, -1379.88864,
		6.54369, -6.20873,
		-0.14163, -0.32700, 0.17937, -0.34864,
		0.01393, -0.01286,
		0.02876, -0.05767,
		0.02210, -0.00128,
		0.16495, -0.01242,
		1.15915, -0.10365,
		-0.33224, -0.10045, 6.83719, -0.27499,
		-0.31284, -0.94332,
		1.63704, -0.33318, 1.48134, -1.32257,
		0.96498, -8.31047,
		-0.00402, -0.09441,
		0.04292, -0.00444,
		0.30325, -0.02012,
		1.67999, 0.00353,
		0.00467, 0.03556,
		0.01393, -0.01229,
		0.01188, -0.01390, 0.04615, -0.03509,
		0.32423, -0.12491, 0.13682, 0.15131,
		0.11221, -0.01201,
		0.57239, 0.00093,
		0.02068, -0.01162, 0.00647, -0.00325,
		0.27010, -0.42993, 0.14314, -0.01353,
		-0.08757, -0.00699,
		0.00199, 0.31873, 18.80329, 0.01681,
		0.08009, -0.00998,
		-0.14421, -0.15912,
		0.37208, 0.49744, 0.35144, 0.06582,
		-0.11501, -0.14037,
		0.10352, -0.00768,
		0.04826, -0.00423,
		0.19850, 0.00310,
		-0.01780, 0.01350,
		-0.61106, -0.20525, -0.04388, 0.52143,
		0.19300, -0.21446,
		-0.05749, -0.04776,
		0.12877, -0.10908,
		0.39821, 0.00627, 34.03956, 0.04392,
		-0.34455, 0.22015, 0.11743, 0.04638,
		0.20723, -0.30447, 0.10976, -0.01008,
		-0.20778, -0.21822,
		0.24939, 0.27976, 0.79790, 0.20200
	],
	arg_tbl: [
		0, 3,
		2, 1, 7, -2, 8, 0,
		3, 3, 5, -8, 6, 3, 8, 0,
		2, 2, 7, -4, 8, 0,
		3, 1, 5, -3, 6, 3, 8, 0,
		2, 3, 7, -6, 8, 0,
		2, 4, 7, -8, 8, 0,
		3, 1, 6, -6, 7, 6, 8, 0,
		3, 1, 6, -5, 7, 4, 8, 0,
		3, 1, 6, -4, 7, 2, 8, 0,
		2, 1, 6, -3, 7, 0,
		3, 1, 6, -2, 7, -1, 8, 0,
		2, 5, 7, -9, 8, 1,
		2, 4, 7, -7, 8, 1,
		2, 3, 7, -5, 8, 1,
		2, 2, 7, -3, 8, 0,
		2, 1, 7, -1, 8, 1,
		1, 1, 8, 2,
		2, 1, 7, -3, 8, 0,
		2, 2, 7, -5, 8, 1,
		3, 1, 6, -6, 7, 5, 8, 0,
		3, 1, 6, -5, 7, 3, 8, 0,
		2, 5, 7, -8, 8, 0,
		2, 4, 7, -6, 8, 0,
		2, 3, 7, -4, 8, 0,
		2, 2, 7, -2, 8, 1,
		1, 1, 7, 0,
		1, 2, 8, 2,
		2, 1, 7, -4, 8, 0,
		2, 5, 7, -7, 8, 0,
		2, 4, 7, -5, 8, 0,
		2, 3, 7, -3, 8, 0,
		2, 2, 7, -1, 8, 0,
		2, 1, 7, 1, 8, 0,
		1, 3, 8, 1,
		2, 1, 6, -2, 8, 1,
		2, 5, 7, -6, 8, 0,
		2, 4, 7, -4, 8, 0,
		1, 4, 8, 1,
		3, 2, 5, -4, 6, -1, 8, 1,
		3, 1, 6, 1, 7, -3, 8, 0,
		2, 1, 6, -1, 8, 1,
		3, 1, 6, -1, 7, 1, 8, 0,
		3, 2, 5, -6, 6, 1, 8, 0,
		2, 5, 7, -5, 8, 1,
		1, 1, 6, 0,
		2, 6, 7, -6, 8, 0,
		2, 7, 7, -7, 8, 0,
		2, 2, 6, -2, 8, 0,
		3, 2, 5, -3, 6, -1, 8, 0,
		2, 2, 6, -1, 8, 1,
		2, 1, 5, -2, 8, 0,
		3, 3, 5, -5, 6, -1, 8, 0,
		2, 4, 7, 5, 8, 0,
		2, 1, 5, -1, 8, 1,
		3, 1, 5, -1, 7, 1, 8, 1,
		3, 1, 5, -5, 6, 1, 8, 1,
		1, 1, 5, 0,
		2, 2, 5, -1, 8, 1,
		-1
	]
};

// pluto.js
$ns.pluto = {
	maxargs: 9,
	max_harmonic: [0, 0, 0, 0, 2, 2, 9, 13, 13],
	max_power_of_t: 7,
	distance: 3.9539999999999999e+01,
	timescale: 3652500.0,
	trunclvl: 1.0,
	lon_tbl: [
		74986469.33577, 100898343.73690, 48199471.54076, 9520076.03177,
		690431.67340, -427355.12716, 52266623.77862, 860190.70714,
		-21.08511, -143.39295,
		-126.71124, 48.18528,
		-88.74508, 40.50942,
		51.29367, -10.24075,
		0.63094, 32.03258,
		-410.00781, 399.90234, -116.54319, 51.50329,
		116.84565, 687.76781, -13.38605, 182.70107,
		-1668.12226, -5162.22648, -585.68297, -2247.56041,
		-20.95875, -193.13703,
		-57.12097, -10.35058,
		-1778.01442, -6463.73779, -657.86093, -2713.44436,
		-41.32560, -211.82042,
		-107.16513, -36.58628,
		97929588.08231, -33582903.63417, 143382679.31770, -47411568.92345,
		79428827.73581, -24658834.87499, 19861233.17488, -5755585.62084,
		1995060.95931, -693507.08147, 135176.31467, 109360.38672,
		-8188.00598, -1680.95072, 71020.19608, -70785.39049,
		-24.56034, -20.34919,
		1618.45976, -2079.48538, 635.62954, -850.87068,
		44.95257, -64.04459,
		-18.61475, -1.77734,
		9.38079, 5.19958,
		17422.08783, -4872.53852, 10985.76629, -1137.68569,
		1771.28893, 288.93745, 40.22664, 37.90027,
		6.81361, -32.65868,
		16.97268, 11.76152,
		29.33024, -12.92289,
		-55.13187, -14.73791,
		7.52474, -102.05060,
		182.53144, -20.18960,
		-490237997.49400, 486646248.63360, -781277018.26430, 602300460.57290,
		-463787999.46420, 249529525.96100, -123964746.86420, 31353019.97807,
		-13353800.92159, -3463382.63269, -35469.17654, -1035343.45385,
		65076.64025, -38181.61312, -16473.33813, 3928.44674,
		188.60263, 1000.42530,
		-208376.39376, -700566.62363, 114839.84613, -342407.71113,
		39467.04812, -14553.84849,
		581895.26100, 1012499.16715, 406317.22416, 310804.78515,
		43625.07033, -4157.26545,
		-5930.13795, -2070.62413,
		3348.17582, -10871.23729,
		144609.18550, 60383.63650, 27912.02226, 15254.61228,
		-98561.37758, -67442.28158, -15573.63338, -19931.99773,
		24323.06905, -37473.32558, 2840.64042, -8911.23694,
		-19636.31898, 71725.21946, -12280.54554, 12251.00101,
		88626.52260, 5513.68450, 18506.41546, -6513.87434,
		-83350.14621, 44300.00743, -22075.37353, 3731.57531,
		-29167.76020, -21642.67384,
		56602666.72177, -22225578.01823, 50576897.80669, -50319847.79086,
		5689259.25622, -29585299.79697, -4249711.27661, -4490830.29568,
		-727678.08724, 366050.85631, 19183.62792, 55647.98226,
		1897.78091, -1091.03988, 432.38158, -138.62556,
		101.38743, 25.67379,
		320.20735, 362.16615, 85.06067, 54.02616,
		2.39460, 18.70004,
		-8.43353, 2.72100,
		-3.11205, -3.06201,
		136.31503, -28.33620, 48.68781, -18.45285,
		1.15302, -1.52360,
		-0.13706, -0.37489,
		0.08750, -0.14579,
		-0.07051, -0.06518,
		0.30237, -0.00448,
		4.83172, 6.83684,
		1752447.78043, -945086.75857, 2340978.12819, -1963675.42559,
		1254147.25257, -1274861.91191, 279459.60237, -263954.01378,
		11835.62290, -16344.44434, 9119.98960, -2390.44218,
		-23.67909, 86.73916, -642.78635, -1290.12208,
		-0.43345, -1.85348,
		0.03094, -0.01655,
		0.12380, 0.31834,
		5.54756, -1.63109, 1.10598, -0.17578,
		2.66994, -2.17573, 0.97360, -0.92226,
		-0.18533, -0.39747,
		0.45809, -0.65286,
		0.26129, 0.91922,
		0.81068, 0.11183,
		6.32182, 14.16786, 0.20872, 3.28489,
		-1.47458, -2.11724,
		1.70020, -1.99889,
		3.13003, 1.90638,
		-4483669.52795, -446454.90158, -6586256.67478, -671890.16779,
		-3620444.55554, -499672.41074, -855998.32655, -191073.94266,
		-73186.69110, -22649.38582, -2414.81729, -1294.40542,
		436.80907, 125.48109, -81.16877, 458.86508,
		-11.57414, -26.39114, -4.00801, -5.01054,
		-18.17569, 20.86879, -4.80965, 3.10535,
		-4.71122, 1.18169,
		74.75544, 649.21464, -26.55060, 272.35592,
		-8.06982, 16.86110,
		-26.54868, 26.75711,
		-35.82910, 38.51063,
		22.22814, 19.38336,
		-6.30462, 0.90602,
		0.62856, -0.34981,
		-0.10232, -0.00939,
		0.04439, -0.18875,
		0.16025, 0.11306,
		-0.06803, 0.06004,
		-91305.66728, 262370.61704, -194633.44577, 304838.17733,
		-124505.90904, 94111.75602, -22317.18255, 1575.23438,
		748.66316, -349.78711, 166.64450, -89.05045,
		120.76207, -100.26715,
		3.13806, 3.71747,
		-1.44731, -0.35235,
		-0.51660, -1.50621,
		2.81310, -3.93573, 1.20292, -0.36412,
		-0.03340, -0.00561,
		-5.29764, 26.02941, 1.91382, 3.30686,
		-3.35265, -3.20868,
		0.05807, -0.11885,
		-0.78588, 0.34807, -0.19038, 0.11295,
		-0.03642, -0.03794,
		0.00251, 0.03449,
		-0.08426, -0.00310,
		0.05297, -0.09278,
		0.10941, 0.00099,
		-228688.56632, 312567.73069, -331458.31119, 328200.19460,
		-143760.57524, 104182.01134, -17313.30132, 12591.15513,
		-440.32735, -105.67674, 104.35854, -852.84590,
		0.95527, 0.30212, -54.63983, 4.06948,
		0.07545, -0.13429,
		16.21005, 29.24658, 9.23410, 50.48867,
		30.55641, 12.76809, 0.11781, 0.70929,
		-0.04100, 13.60859,
		0.04976, -0.02083,
		0.36279, 0.30130, -0.02129, 0.09363,
		-0.07812, 0.01570,
		-0.06217, -0.37181,
		-29348.55031, 43889.87672, -35765.41577, 33855.90070,
		-10128.69894, 4535.32148, 281.75353, -218.49194,
		-7.55224, 134.28640, 2.11319, -2.13109,
		15.71244, 11.07183,
		-0.05406, -0.23337,
		-1.28949, 1.34281,
		0.04212, -0.02080,
		0.08109, 0.14820,
		-6010.46564, 3639.41780, -5973.16000, 1381.66999,
		-1177.36865, -501.06937, 166.14792, -103.36431,
		14.92766, 4.12877, -2.20893, -6.32033,
		-0.29038, -0.43172,
		-0.59341, 0.20477, -0.13143, -0.03150,
		0.10992, 0.01976,
		-0.00254, 0.02028,
		-0.30044, -0.44658, -0.03409, -0.10758,
		0.08349, 0.06153,
		-0.06055, 0.18249,
		-1.15341, -8.68699, -0.11348, -3.30688,
		1.08604, 1.04018,
		-0.46892, -0.69765, 0.21504, 0.01968,
		-0.00455, -0.01678,
		3.95643, -3.17191, 3.95220, -2.12670,
		0.99305, -0.16651,
		0.34839, -0.49162,
		0.85744, 0.20173, -0.00975, 0.20225,
		-0.02627, -0.02281,
		-0.18002, -0.01803,
		-0.06144, -0.21510,
		0.15935, -0.01251,
		-0.21378, 0.44806, -0.01174, 0.05779,
		0.07646, -0.19656, -0.04044, -0.02521,
		0.02996, 0.06169,
		0.16698, -0.04710, -0.06506, -0.02114,
		0.05500, 0.00276,
		0.08433, 0.03160,
		0.08193, 0.35773, 0.05454, 0.10718,
		-0.02823, -0.00839,
		0.54078, 0.49347, 0.09609, 0.11825,
		-0.16092, -0.11897,
		0.09059, 0.08254,
		0.16712, 0.05860,
		-0.09547, -0.03206,
		0.03876, 0.04719,
		-0.02345, 0.02240,
		-0.00609, -0.00649,
		0.03859, 0.00077,
		0.47819, 0.26196, 0.09780, 0.08104,
		-0.16919, 0.05042,
		-0.42652, 0.30810,
		-0.03409, -0.51452,
		-0.23120, -0.01380,
		-0.01157, -0.00143,
		-0.00512, -0.01628,
		-0.00189, 0.00183,
		-0.01427, -0.02861,
		0.00618, -0.00015,
		0.13087, 0.13870,
		0.15158, -0.21056,
		-3.94829, -1.06028, -1.36602, 0.77954,
		0.08709, -0.03118,
		-44.74949, 91.17393, 8.78173, 45.84010,
		1.97560, -15.02849, -0.10755, -0.02884,
		3.38670, 0.30615,
		130.92778, -24.33209, 43.01636, -40.81327,
		-19.43900, 22.18162, -0.12691, 0.33795,
		-6.44790, -6.23145,
		0.00319, 0.01141,
		-0.03252, 0.03872,
		0.04467, 0.01614,
		-0.00382, -0.00019,
		0.05955, 0.01533,
		16.11371, 41.37565, 61.44963, 6.90615,
		1.41326, -0.73920, -0.03871, 24.81978,
		-0.10229, -0.32775, -0.05188, -0.05628,
		-2.33618, 2.39053,
		-0.00584, 0.00436,
		0.20903, 0.02220,
		-0.01738, -0.02765,
		-0.00217, 0.00613,
		-0.01772, 0.01903,
		0.07075, -0.00530,
		0.15234, -0.37760, -0.11641, -0.20102,
		-0.63675, 0.20525, -0.15783, 0.58945,
		-0.06243, 0.04306
	],
	lat_tbl: [
		-35042727.30412, -49049197.81293, -25374963.60995, -5761406.03035,
		-467370.57540, 14040.11453, 2329.15763, -13978.69390,
		45.43441, 29.70305,
		32.33772, -38.34012,
		26.43575, -28.76136,
		-18.59040, 12.64837,
		5.56569, -12.51581,
		248.37350, -64.44466, 54.02618, 4.39466,
		-269.35114, -290.63134, -48.03841, -52.83576,
		1508.94995, 1682.78967, 554.02336, 715.65819,
		34.37602, 58.44397,
		16.63685, 16.10176,
		-1069.51609, 2300.89166, -437.16796, 927.89245,
		-33.17679, 68.74495,
		18.72022, 32.97640,
		-34004958.12619, -17758805.77098, -48416073.75788, -24973405.03542,
		-25374996.23732, -13351084.97340, -5738294.54942, -3082092.63350,
		-519989.39256, -206440.89101, 44186.23548, -87639.22630,
		2506.47602, 2327.01164, -53878.47903, -19670.13471,
		2.66934, -3.86086,
		106.32427, 576.47944, 46.56388, 218.28339,
		4.35402, 15.04642,
		2.68717, -2.86835,
		0.81728, -2.34417,
		-1604.85823, -1999.24986, -631.47343, -1382.19156,
		-15.74075, -256.97077, 6.99648, -4.54257,
		2.63478, 1.88838,
		0.17628, -2.11518,
		-2.46735, -1.48743,
		1.83456, 4.68487,
		-7.10919, 3.57046,
		-5.36342, -7.70367,
		28395956.20816, -37176795.74372, 48969952.83034, -48145798.96248,
		31155823.23557, -21163596.14822, 9057634.38260, -3167688.51696,
		1167488.70078, 219103.97591, -19017.97335, 107849.61195,
		-3814.43474, 4405.92120, 5800.13959, 12619.88708,
		22.18168, -89.47801,
		52202.81929, 55119.44083, 5082.58907, 37955.06062,
		-3165.24355, 3316.67588,
		-113906.43970, -69279.41495, -57358.07767, -10176.17329,
		-4179.79867, 2495.99374,
		787.87180, -154.35591,
		-1148.62509, 1034.58199,
		-22194.95235, 3341.97949, -4578.53994, 108.30832,
		7444.39789, 16646.40725, 509.75430, 3808.92686,
		-179.85869, 7408.76716, 340.65366, 1504.64227,
		-3783.09873, -13505.60867, 875.74489, -3181.27898,
		-16220.93983, 8041.37347, -2631.07448, 2899.50781,
		18894.92095, -20072.81471, 5925.05701, -1947.91902,
		-6731.56601, 8014.52403,
		-987793.49463, 6491762.34471, -279205.73643, 6117135.96868,
		-140925.91402, 2259422.06929, 114028.61646, 605600.90358,
		91858.00186, 56506.65187, 8949.15777, -9782.67413,
		-394.66541, -105.19208, -76.54752, -32.59411,
		-19.28741, 10.40013,
		-107.64003, -7.36229, -22.25126, 4.05952,
		-3.74402, -2.79308,
		1.03337, -2.13968,
		1.53794, -0.02617,
		35.70756, 12.97733, 14.46213, 6.20518,
		1.79381, 1.65422,
		-0.31216, 0.29053,
		-0.03538, -0.01584,
		-0.08934, 0.00079,
		0.05539, -0.21591,
		2.86929, -2.24724,
		320797.07455, 93342.16556, -20903.39115, 79523.22083,
		-226588.37473, -121017.23944, -48472.25935, -74195.36778,
		-7962.48081, -4607.76339, -4597.33274, -7983.12541,
		-20.34500, 56.82999, -1038.19507, 619.69624,
		1.08907, -0.91278,
		-0.13391, 0.34956,
		-0.19982, -0.18296,
		-0.97688, 2.36806, -0.30127, 0.50980,
		0.96103, 1.96432, 0.43338, 0.87317,
		0.36997, -0.01583,
		-0.44692, -0.25159,
		-0.53525, 0.01154,
		-0.13231, 0.35562,
		3.88928, -4.02882, 1.06967, -0.56305,
		-0.45204, 0.77213,
		-0.82873, -0.25854,
		0.21136, -1.06696,
		458529.05491, 616790.47568, 698431.01349, 1124501.41713,
		300226.10339, 766533.33698, 26896.22954, 207880.75720,
		1116.29607, 21793.26153, -850.64044, 3528.95568,
		29.61278, -120.13367, 376.95131, 66.45758,
		-3.64868, 2.76062, -0.85352, 0.95115,
		5.35056, 2.52803, 0.90026, 0.76403,
		0.43191, 0.83605,
		125.81792, -39.65364, 50.14425, -5.75891,
		2.78555, 2.05055,
		-4.27266, -4.92428,
		6.78868, 5.73537,
		3.35229, -3.70143,
		0.08488, 1.07465,
		0.10227, 0.06074,
		0.00291, 0.01522,
		-0.02274, 0.00297,
		0.01095, -0.01856,
		-0.02862, 0.00178,
		143640.07486, 707.21331, 177163.08586, 53386.52697,
		56856.89297, 48268.74645, 1764.52814, 7711.76224,
		352.34159, -968.03169, -45.16568, -81.60481,
		-76.35993, -98.06932,
		-1.42185, 1.81425,
		-0.23427, 0.59023,
		0.57127, -0.36335,
		1.89975, 0.66890, 0.28797, 0.43592,
		-0.03769, 0.03273,
		-6.06571, -2.68515, -0.55315, 0.86977,
		1.53840, -0.59422,
		-0.05453, 0.02447,
		-0.12658, 0.22814, -0.01715, 0.08497,
		-0.01288, -0.00606,
		0.01547, -0.00692,
		0.01157, 0.02407,
		-0.03883, 0.00835,
		-0.01542, -0.04761,
		174386.39024, 158048.26273, 159192.81681, 220154.55148,
		33716.11953, 87537.86597, -116.90381, 7535.83928,
		-962.06994, -132.28837, -644.90482, -110.52332,
		3.42499, 3.74660, -0.94008, 41.55548,
		-0.03824, -0.05607,
		28.74787, -37.31399, 30.87853, -26.11940,
		10.79742, -5.97905, 1.01237, -0.04429,
		0.54402, 0.41905,
		-0.02440, -0.03991,
		-0.00347, -0.04362, -0.00347, -0.00469,
		-0.02707, 0.02761,
		-0.17773, -0.11789,
		26475.02580, 35363.04345, 19877.11475, 41430.35940,
		2948.09998, 12983.41406, 281.93744, 570.70054,
		147.83157, 16.00090, -1.62814, -8.30846,
		9.29131, -10.16496,
		-0.15799, 0.03843,
		1.44716, 0.46953,
		-0.02150, -0.02502,
		0.08861, -0.06690,
		2237.41551, 3739.08722, 753.74867, 3460.41553,
		-298.69226, 520.47031, -33.62615, -138.12767,
		3.61843, -8.29860, -4.56656, 0.79553,
		0.20041, -0.25771,
		-0.35233, -0.27913, -0.02799, -0.08328,
		-0.06889, -0.16853,
		0.01701, -0.00964,
		-0.37737, 0.18030, -0.08525, 0.01906,
		0.05236, -0.05155,
		0.11320, 0.05991,
		-5.66926, -0.54402, -2.08508, -0.39407,
		0.82155, -0.55975,
		0.39168, -0.25551, 0.00623, 0.16162,
		-0.02519, 0.02420,
		-1.23293, -3.19649, -0.60519, -2.79729,
		0.05362, -0.61569,
		-0.25638, -0.27033,
		-0.03987, 0.46623, -0.12070, 0.00643,
		0.00849, -0.00768,
		-0.03687, 0.10445,
		-0.13544, -0.00592,
		0.02078, 0.09172,
		0.15824, 0.15815, 0.02020, 0.00747,
		0.10919, 0.09553, 0.01953, -0.00135,
		0.04266, -0.00218,
		0.02182, -0.13742, -0.01249, 0.01724,
		-0.02200, 0.02975,
		-0.01401, 0.03416,
		-0.28873, 0.04235, -0.08137, 0.04223,
		-0.00326, 0.02144,
		-0.40423, 0.14281, -0.08256, 0.02142,
		0.08116, -0.03680,
		-0.02324, 0.07260,
		-0.06746, 0.11645,
		0.03233, -0.05997,
		-0.03101, 0.02197,
		-0.00896, -0.00491,
		0.00574, 0.00855,
		0.00052, 0.01209,
		-0.31828, 0.29955, -0.08133, 0.04318,
		0.06787, -0.08865,
		-0.13228, -0.06507,
		0.34008, 0.06417,
		-0.00177, -0.15116,
		-0.00553, -0.01950,
		0.01144, -0.00309,
		-0.00115, -0.00153,
		0.02063, -0.00791,
		-0.00314, 0.00493,
		-0.10614, 0.08338,
		0.08845, 0.20168,
		1.38955, -2.52285, -0.30475, -1.05787,
		0.00580, 0.06623,
		-44.33263, -47.70073, -29.80583, -8.77838,
		7.02948, 2.77221, 0.05248, -0.13702,
		-0.78176, 1.77489,
		-16.32831, 46.68457, 2.54516, 21.78145,
		-5.09080, -8.42611, -0.24419, -0.03315,
		2.80629, -1.12755,
		-0.00402, 0.00053,
		0.00024, -0.00043,
		0.00403, -0.00210,
		0.00603, 0.00411,
		-0.00260, 0.00416,
		2.29235, 3.05992, 2.36465, -0.58750,
		0.14030, 0.13523, 0.89998, 0.70156,
		-0.02188, 0.02003, -0.00533, 0.00447,
		2.96411, 1.30183,
		0.01422, 0.00624,
		-0.10737, -0.38316,
		-0.05968, 0.04379,
		0.01171, 0.01180,
		-0.00989, -0.01375,
		-0.00845, 0.03782,
		0.09484, 0.09909, 0.07640, -0.00898,
		-0.01076, 0.02760, 0.01630, 0.02198,
		0.05985, 0.04130
	],
	rad_tbl: [
		17990649.12487, 24806479.30874, 12690953.00645, 2892671.69562,
		249947.71316, -5138.71425, 1142.68629, 6075.25751,
		-34.76785, -19.72399,
		-15.81516, 30.47718,
		-11.73638, 21.87955,
		9.42107, -10.40957,
		-5.59670, 6.85778,
		-167.06735, -2.31999, -32.42575, -13.72714,
		130.16635, 117.97555, 31.33915, 39.64331,
		-1378.54934, -395.83244, -562.79856, -167.74359,
		-45.12476, -17.08986,
		-4.20576, -16.56724,
		1762.12089, -1148.86987, 736.55320, -423.09108,
		56.13621, -26.26674,
		9.77810, -38.05151,
		4702224.98754, 27254904.94363, 5306232.25993, 39518429.29982,
		1725110.05669, 21833263.27069, 46010.62605, 5425411.66252,
		17238.09865, 536771.62156, -61263.36051, 66270.70142,
		2084.66296, -1936.71208, 35898.49503, 34885.28549,
		1.93276, 10.66292,
		-665.11445, 3.70467, -265.68478, 16.16272,
		-19.45954, 2.32738,
		3.04237, 3.97339,
		-2.64312, 0.66308,
		-3207.68754, 3418.03720, -2342.62310, 1729.15030,
		-450.84643, 179.00943, -13.20367, -1.86087,
		-4.95659, 7.22347,
		-5.08890, -1.28891,
		-6.21713, 5.10551,
		13.97276, 0.44529,
		3.25177, 25.02775,
		-45.56672, 11.58470,
		124443355.55450, -100018293.41775, 190506421.77863, -118262753.40162,
		108199328.45091, -45247957.63323, 27272084.41143, -4125106.01144,
		2583469.66051, 1024678.12935, -22702.55109, 199269.51481,
		-15783.14789, 5564.52481, -427.22231, -6330.86079,
		-97.50757, -204.32241,
		-9060.54822, 156661.77631, -47791.83678, 59725.58975,
		-8807.74881, -92.38886,
		-28886.11572, -244419.59744, -53336.36915, -92232.16479,
		-8724.89354, -2446.76739,
		889.71335, 936.51108,
		494.80305, 2252.83602,
		-18326.60823, -25443.13554, -3130.86382, -5426.29135,
		23494.08846, 91.28882, 4664.14726, 1552.06143,
		-8090.43357, 2843.48366, -1445.73506, 1023.11482,
		11664.20863, -7020.08612, 3100.21504, -64.16577,
		-9724.97938, -12261.47155, -3008.08276, -1523.06301,
		6788.74046, 10708.27853, 343.09434, 1701.52760,
		14743.99857, -4781.96586,
		-15922236.41469, 1825172.51825, -14006084.36972, 10363332.64447,
		-979550.91360, 6542446.18797, 1160614.26915, 570804.88172,
		89912.68112, -171247.08757, -13899.52899, -6182.25841,
		-240.64725, 412.42581, -66.24510, 71.30726,
		-15.81125, -15.76899,
		-21.85515, -102.12717, -10.18287, -19.38527,
		1.43749, -3.87533,
		1.97109, 0.20138,
		0.32012, 1.02928,
		-40.22077, 20.80684, -15.69766, 9.63663,
		-1.26010, 0.56197,
		0.08592, 0.18540,
		-0.07303, 0.03897,
		0.01438, -0.08809,
		0.15479, 0.10354,
		0.19052, 2.08790,
		405480.24475, -607986.83623, 582811.58843, -915111.10396,
		258696.21023, -493391.09443, 23403.62628, -119503.67282,
		-4036.86957, -9766.17805, -663.93268, 2544.07799,
		40.36638, 76.26390, 246.67716, -13.93440,
		0.12403, 0.25378,
		0.14004, -0.08501,
		0.07904, 0.12731,
		1.02117, -1.34663, 0.25142, -0.26903,
		0.18135, -0.57683, -0.30092, -0.36121,
		-0.09623, 0.05873,
		-0.05803, 0.02869,
		-0.01194, 0.04983,
		0.04250, 0.04894,
		1.34245, 0.70137, 0.24217, 0.25912,
		-0.32759, -0.03575,
		0.06780, -0.41277,
		0.43865, 0.17857,
		-763933.02226, 465658.17048, -1082753.91241, 593319.68634,
		-553911.89340, 274748.95145, -122250.71547, 56608.95768,
		-9914.17300, 2988.43709, 707.94605, -765.01470,
		52.73260, -34.22263, -43.58300, -38.43647,
		-4.95939, -1.97173, -1.04406, -0.13072,
		-0.34281, 4.75202, -0.35513, 0.93597,
		-0.54380, 0.70536,
		84.83116, 102.93003, 26.34884, 48.57746,
		0.02853, 2.91676,
		-8.07116, 1.66613,
		-2.07908, 11.62592,
		6.64704, 0.98291,
		-1.19192, 0.93791,
		0.18822, 0.00900,
		-0.03181, -0.02000,
		0.02755, -0.01398,
		-0.03971, -0.03756,
		0.13454, -0.04193,
		-18672.98484, 28230.75834, -28371.58823, 26448.45214,
		-13352.09393, 7461.71279, -2609.33578, 726.50321,
		-309.72942, -86.71982, 12.48589, -9.69726,
		1.82185, 14.92220,
		-0.04748, 0.42510,
		-0.20047, 0.00154,
		0.00176, -0.26262,
		0.78218, -0.73243, 0.23694, -0.03132,
		-0.00290, -0.03678,
		14.03094, 4.25948, 0.79368, -0.78489,
		-2.30962, 2.31946,
		0.00158, -0.04125,
		-0.01387, 0.28503, 0.00892, 0.05154,
		0.00184, -0.01727,
		-0.00889, 0.03526,
		-0.00521, -0.02093,
		0.00200, 0.04872,
		-0.02163, 0.00578,
		20699.27413, -2175.57827, 31177.33085, 4572.02063,
		15486.28190, 8747.74091, 2455.51737, 3839.83609,
		51.31433, 507.91086, 15.90082, 44.75942,
		-0.98374, -2.64477, 2.52336, -3.09203,
		-0.08897, -0.00083,
		-15.91892, 0.72597, 14.04523, -3.16525,
		4.33379, -30.82980, 0.40462, -0.75845,
		13.14831, -0.02721,
		-0.01779, 0.00481,
		0.42365, -0.09048, 0.08653, 0.04391,
		0.00846, 0.01082,
		-0.04736, 0.02308,
		6282.21778, -4952.70286, 7886.57505, -5328.36122,
		3113.76826, -1696.84590, 330.70011, -155.51989,
		-18.31559, -3.90798, -3.11242, 1.87818,
		-1.05578, 0.11198,
		0.05077, -0.01571,
		2.41291, 2.40568,
		-0.01136, -0.00076,
		-0.00392, -0.02774,
		634.85065, -352.21937, 674.31665, -260.73473,
		199.16422, -28.44198, 6.54187, 6.44960,
		-1.55155, 0.29755, 0.16977, 0.17540,
		-0.02652, 0.03726,
		-0.00623, 0.11777, -0.00933, 0.02602,
		-0.13943, -0.24818,
		0.02876, -0.01463,
		-0.07166, 0.06747, -0.01578, 0.01628,
		0.00233, -0.00686,
		0.00431, -0.00276,
		0.21774, 0.09735, 0.07894, 0.07279,
		-0.01300, -0.00268,
		0.10824, 0.09435, 0.00720, 0.02111,
		-0.01960, 0.06154,
		0.56867, -0.07544, 0.18210, 0.06343,
		-0.00906, 0.01942,
		-0.00850, -0.00351,
		-0.06988, 0.01713, -0.01110, -0.00663,
		0.00196, -0.02064,
		-0.00008, 0.00043,
		0.00375, 0.00084,
		-0.00279, 0.00100,
		0.00271, -0.02017, -0.00074, -0.00357,
		0.03793, -0.10108, -0.01083, -0.03952,
		0.00030, 0.00012,
		0.01576, 0.01142, 0.00351, 0.00277,
		0.01409, -0.00774,
		-0.00065, 0.01895,
		0.07350, -0.02519, 0.01528, -0.01057,
		-0.00099, -0.00295,
		0.21347, -0.17458, 0.04940, -0.02757,
		-0.06243, 0.05203,
		0.01055, -0.00109,
		0.00003, -0.04201,
		-0.00263, 0.02387,
		0.00886, -0.01168,
		0.00479, 0.00204,
		-0.00239, 0.00022,
		-0.00223, -0.02029,
		-0.14130, -0.15237, -0.01827, -0.04877,
		0.12104, 0.06796,
		0.16379, 0.31892,
		-0.15605, 0.07048,
		-0.00700, 0.07481,
		-0.00370, -0.00142,
		-0.00446, 0.00329,
		-0.00018, 0.00117,
		-0.00910, 0.00510,
		-0.00055, -0.00114,
		0.04131, -0.04013,
		-0.13238, 0.02680,
		-0.10369, 1.38709, 0.35515, 0.41437,
		-0.01327, -0.02692,
		38.02603, 13.38166, 15.33389, -7.40145,
		-8.55293, -0.13185, -0.03316, 0.13016,
		0.04428, -1.60953,
		-12.87829, -76.97922, -23.96039, -22.45636,
		14.83309, 14.09854, 0.24252, 0.13850,
		-4.16582, 4.08846,
		0.00751, -0.00051,
		0.03456, 0.02900,
		0.01625, -0.04660,
		0.01390, -0.00530,
		0.01665, -0.04571,
		40.90768, -14.11641, 7.46071, -58.07356,
		-0.27859, -1.33816, 23.76074, -0.03124,
		-0.27860, 0.13654, -0.04800, 0.05375,
		4.38091, 4.39337,
		0.02233, 0.00514,
		-0.25616, -0.54439,
		-0.05155, 0.11553,
		0.02944, -0.00818,
		0.00570, 0.00119,
		-0.00733, -0.02700,
		-0.23759, -0.08712, -0.12433, 0.07397,
		0.20629, 0.60251, 0.56512, 0.14790,
		0.07778, 0.11614
	],
	arg_tbl: [
		0, 7,
		2, 3, 7, -9, 9, 0,
		2, 4, 7, -12, 9, 0,
		2, 4, 7, -8, 8, 0,
		3, -4, 7, 5, 8, 4, 9, 0,
		3, 3, 7, -5, 8, -1, 9, 0,
		2, 1, 6, -8, 9, 1,
		2, 3, 8, -5, 9, 1,
		2, 1, 6, -9, 9, 2,
		3, 6, 7, -6, 8, -8, 9, 0,
		3, 4, 7, -10, 8, 4, 9, 2,
		2, 3, 7, -8, 9, 0,
		1, 1, 9, 7,
		2, 3, 7, -10, 9, 0,
		3, 4, 7, -10, 8, 2, 9, 2,
		3, 5, 7, -12, 8, 2, 9, 0,
		2, 1, 6, -7, 9, 0,
		1, 1, 8, 3,
		2, 1, 6, -10, 9, 0,
		3, 6, 7, -12, 8, 2, 9, 0,
		3, 5, 7, -10, 8, 2, 9, 0,
		2, 5, 7, -13, 9, 0,
		2, 4, 7, -10, 9, 0,
		2, 3, 7, -7, 9, 0,
		1, 2, 9, 7,
		2, 3, 7, -11, 9, 0,
		3, 4, 7, -9, 8, 4, 9, 2,
		3, 3, 7, -5, 8, 1, 9, 2,
		2, 1, 6, -6, 9, 0,
		2, 7, 8, -13, 9, 0,
		2, 3, 8, -2, 9, 1,
		3, 1, 7, -5, 8, 2, 9, 1,
		3, 6, 7, -12, 8, 3, 9, 1,
		2, 5, 7, -12, 9, 1,
		2, 4, 7, -9, 9, 1,
		2, 2, 7, -3, 9, 1,
		1, 1, 7, 0,
		1, 3, 9, 5,
		2, 3, 7, -12, 9, 1,
		3, 5, 7, -9, 8, 2, 9, 0,
		3, 4, 7, -7, 8, 2, 9, 1,
		3, 3, 7, -5, 8, 2, 9, 0,
		3, 2, 7, -5, 8, 5, 9, 0,
		2, 1, 6, -5, 9, 0,
		2, 3, 8, -1, 9, 2,
		2, 1, 6, -12, 9, 0,
		3, 2, 7, -7, 8, 1, 9, 0,
		2, 5, 7, -11, 9, 0,
		2, 4, 7, -8, 9, 0,
		2, 2, 7, -2, 9, 0,
		1, 4, 9, 7,
		3, 2, 7, -8, 8, 2, 9, 0,
		3, 5, 7, -9, 8, 3, 9, 0,
		3, 4, 7, -9, 8, 6, 9, 0,
		3, 3, 7, -5, 8, 3, 9, 1,
		2, 2, 7, -1, 8, 1,
		2, 3, 8, -9, 9, 0,
		2, 9, 8, -9, 9, 0,
		2, 1, 6, -13, 9, 0,
		3, 2, 7, -5, 8, -3, 9, 0,
		2, 6, 7, -13, 9, 1,
		2, 5, 7, -10, 9, 0,
		2, 4, 7, -7, 9, 0,
		2, 3, 7, -4, 9, 0,
		1, 5, 9, 7,
		3, 6, 7, -9, 8, 1, 9, 1,
		3, 4, 7, -5, 8, 1, 9, 1,
		3, 3, 7, -3, 8, 1, 9, 0,
		2, 1, 6, -3, 9, 2,
		2, 3, 8, -10, 9, 0,
		2, 1, 8, 4, 9, 0,
		2, 5, 8, -2, 9, 0,
		2, 11, 8, -11, 9, 0,
		3, 1, 7, -9, 8, 5, 9, 0,
		2, 6, 7, -12, 9, 0,
		2, 5, 7, -9, 9, 0,
		2, 4, 7, -6, 9, 0,
		2, 3, 7, -3, 9, 0,
		1, 6, 9, 6,
		2, 2, 7, -12, 9, 0,
		3, 6, 7, -9, 8, 2, 9, 0,
		3, 3, 7, -12, 8, 3, 9, 0,
		3, 4, 7, -10, 8, -3, 9, 1,
		3, 3, 7, -3, 8, 2, 9, 0,
		2, 1, 6, -2, 9, 2,
		2, 1, 8, 5, 9, 0,
		2, 13, 8, -13, 9, 1,
		3, 2, 7, -9, 8, 1, 9, 0,
		2, 6, 7, -11, 9, 0,
		2, 5, 7, -8, 9, 0,
		2, 4, 7, -5, 9, 0,
		2, 3, 7, -2, 9, 0,
		1, 7, 9, 7,
		3, 6, 7, -9, 8, 3, 9, 0,
		2, 1, 6, -1, 9, 4,
		2, 3, 8, 3, 9, 0,
		2, 7, 7, -13, 9, 1,
		2, 3, 7, -1, 9, 0,
		2, 2, 7, 2, 9, 0,
		1, 8, 9, 6,
		3, 7, 7, -9, 8, 1, 9, 0,
		1, 1, 6, 0,
		1, 3, 7, 0,
		2, 2, 7, 3, 9, 0,
		1, 9, 9, 5,
		3, 1, 7, -10, 8, 3, 9, 0,
		3, 2, 7, -12, 8, 3, 9, 1,
		2, 1, 6, 1, 9, 0,
		3, 1, 7, -1, 8, 8, 9, 0,
		2, 3, 7, 1, 9, 1,
		2, 2, 7, 4, 9, 0,
		2, 1, 7, 7, 9, 0,
		2, 4, 8, 4, 9, 1,
		2, 12, 8, -8, 9, 0,
		3, 1, 7, -10, 8, 2, 9, 1,
		2, 1, 6, 2, 9, 0,
		1, 11, 9, 2,
		2, 12, 8, -7, 9, 0,
		3, 1, 7, -10, 8, 1, 9, 1,
		1, 4, 7, 0,
		1, 12, 9, 0,
		2, 6, 8, 3, 9, 0,
		3, 1, 7, -2, 8, -12, 9, 0,
		3, 7, 7, -7, 8, 2, 9, 1,
		2, 2, 6, -4, 9, 1,
		1, 13, 9, 0,
		2, 10, 8, -2, 9, 1,
		2, 4, 7, 2, 9, 0,
		2, 2, 6, -3, 9, 0,
		2, 2, 7, 8, 9, 1,
		2, 8, 8, 2, 9, 0,
		1, 5, 7, 1,
		2, 4, 7, 3, 9, 0,
		2, 3, 7, 6, 9, 0,
		2, 1, 5, -6, 9, 0,
		3, 2, 7, 8, 8, -3, 9, 0,
		3, 1, 7, 6, 8, 3, 9, 0,
		2, 6, 8, 6, 9, 0,
		3, 8, 7, -7, 8, 2, 9, 0,
		2, 9, 7, -11, 9, 0,
		2, 5, 7, 1, 9, 1,
		2, 4, 7, 4, 9, 0,
		2, 2, 6, -1, 9, 0,
		3, 2, 6, -1, 7, 2, 9, 0,
		2, 2, 7, 10, 9, 0,
		2, 1, 7, 13, 9, 0,
		2, 8, 7, -7, 9, 0,
		2, 7, 7, -4, 9, 0,
		2, 6, 7, -1, 9, 0,
		2, 5, 7, 3, 9, 0,
		2, 4, 7, 5, 9, 0,
		1, 2, 6, 0,
		2, 1, 5, -4, 9, 1,
		3, 1, 6, 9, 8, -5, 9, 0,
		2, 1, 5, -3, 9, 4,
		2, 1, 5, -2, 9, 4,
		3, 9, 7, -9, 8, 6, 9, 0,
		2, 8, 7, -4, 9, 0,
		2, 7, 7, -1, 9, 0,
		2, 1, 6, 3, 9, 0,
		2, 2, 6, 3, 9, 0,
		2, 1, 5, -1, 9, 3,
		3, 6, 7, -3, 8, 7, 9, 1,
		1, 1, 5, 0,
		2, 2, 6, 5, 9, 0,
		2, 1, 5, 1, 9, 0,
		2, 1, 5, 2, 9, 0,
		2, 1, 5, 3, 9, 0,
		2, 2, 5, -4, 9, 0,
		2, 2, 5, -3, 9, 0,
		2, 2, 5, -2, 9, 1,
		2, 2, 5, -1, 9, 1,
		1, 2, 5, 0,
		-1
	]
};

// shortcut.js
var $e = ephemeris;

var $copy = $e.copy;
var $is = $e.is;
var $make = $e.make;
var $def = $e.define;
var $assert = $e.assert;
var $moshier = $e.astronomy.moshier;
var $const = $e.astronomy.moshier.constant;
var $processor = $moshier.processor;
var $julian = $moshier.julian;
var $util = $moshier.util;

var module = module || {};
module.exports = { ns: $ns, 
e : ephemeris,

copy : $e.copy,
is : $e.is,
make : $e.make,
def : $e.define,
assert : $e.assert,
moshier : $e.astronomy.moshier,
const : $e.astronomy.moshier.constant,
processor : $moshier.processor,
julian : $moshier.julian,
util : $moshier.util,
}

const eph = ephemeris;

function setUp (date, geodeticalLongitude, geodeticalLatitude, height) {
  var d = !date ? new Date() : date;
  if(!eph.const) eph.const = {}
  eph.const.tlong = geodeticalLongitude
  eph.const.glat = geodeticalLatitude
  eph.const.height = height
  eph.const.date = {
    day: d.getUTCDate(),
    month: d.getUTCMonth()+1,
    year: d.getUTCFullYear(),
    hours: d.getUTCHours(),
    minutes: d.getUTCMinutes(),
    seconds: d.getUTCSeconds()
  }
  $processor.init()
}

// Example call: getAllPlanets(new Date(), 10.0014, 53.5653, 0);
function getAllPlanets (_date, geodeticalLongitude, geodeticalLatitude, height) {

  setUp(_date, geodeticalLongitude, geodeticalLatitude, height)

  var ret = {
    date: undefined,
    observer: undefined,
    observed: {}
  }
  let date = eph.const.date
  var observables = Object.keys(ephemeris.astronomy.moshier.body)

  for (var i = 0; i < observables.length; i++) {

    var observeMe = observables[i]
    if (['earth', 'init'].indexOf(observeMe) >= 0) {
      continue
    }

    eph.const.body = ephemeris.astronomy.moshier.body[observeMe]

    $processor.calc(date, eph.const.body)

    if (ret.date === undefined) {
      ret.date = {
        gregorianTerrestrial: [date.day, date.month, date.year].join('.') + ' ' + [date.hours, date.minutes, date.seconds].join(':'),
        gregorianTerrestrialRaw: date,
        gregorianUniversal: (eph.const.date.universalDateString),
        gregorianDelta: ('00:00:' + (eph.const.date.delta)),
        julianTerrestrial: (eph.const.date.julian),
        julianUniversal: (eph.const.date.universal),
        julianDelta: (eph.const.date.delta / 86400)
      }
    }

    if (ret.observer === undefined) {
      ret.observer = {
        name: 'earth',
        longitudeGeodetic: (eph.const.tlong),
        longitudeGeodecentric: (eph.const.tlong),
        latitudeGeodetic: (eph.const.glat),
        latitudeGeodecentric: (eph.const.tlat),
        heightGeodetic: (eph.const.height),
        heightGeodecentric: (eph.const.trho * eph.const.aearth / 1000),
      }
    }

    var body = {
      name: eph.const.body.key,
      raw: eph.const.body,
      apparentLongitudeDms30: (eph.const.body.position.apparentLongitude30String),
      apparentLongitudeDms360: (eph.const.body.position.apparentLongitudeString),
      apparentLongitudeDd: (eph.const.body.position.apparentLongitude),
      geocentricDistanceKm: (eph.const.body.position.geocentricDistance)
    }
    ret.observed[body.name] = body

  }

  return ret
}

// Example call: getPlanet('moon', new Date(), 10.0014, 53.5653, 0);
function getPlanet (planetName, date, geodeticalLongitude, geodeticalLatitude, height) {

  setUp(date, geodeticalLongitude, geodeticalLatitude, height)

  var ret = {
    date: undefined,
    observer: undefined,
    observed: {}
  }
  var date = eph.const.date

  eph.const.body = ephemeris.astronomy.moshier.body[planetName]

  $processor.calc(date, eph.const.body)

  if (ret.date === undefined) {
    ret.date = {
      gregorianTerrestrial: [date.day, date.month, date.year].join('.') + ' ' + [date.hours, date.minutes, date.seconds].join(':'),
      gregorianTerrestrialRaw: date,
      gregorianUniversal: (eph.const.date.universalDateString),
      gregorianDelta: ('00:00:' + (eph.const.date.delta)),
      julianTerrestrial: (eph.const.date.julian),
      julianUniversal: (eph.const.date.universal),
      julianDelta: (eph.const.date.delta / 86400)
    }
  }

  if (ret.observer === undefined) {
    ret.observer = {
      name: 'earth',
      longitudeGeodetic: (eph.const.tlong),
      longitudeGeodecentric: (eph.const.tlong),
      latitudeGeodetic: (eph.const.glat),
      latitudeGeodecentric: (eph.const.tlat),
      heightGeodetic: (eph.const.height),
      heightGeodecentric: (eph.const.trho * eph.const.aearth / 1000),
    }
  }

  var body = {
    name: eph.const.body.key,
    raw: eph.const.body,
    apparentLongitudeDms30: (eph.const.body.position.apparentLongitude30String),
    apparentLongitudeDms360: (eph.const.body.position.apparentLongitudeString),
    apparentLongitudeDd: (eph.const.body.position.apparentLongitude),
    geocentricDistanceKm: (eph.const.body.position.geocentricDistance)
  }
  ret.observed[body.name] = body

  return ret
}

export default {
  ephemeris: eph,
  getAllPlanets,
  getPlanet
}
