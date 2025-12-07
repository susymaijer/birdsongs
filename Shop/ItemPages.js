TEMPORARY_COOKIE_NAME = 'TemporaryValues2';
PERMANENT_COOKIE_NAME = 'PermanentValues2';

/* path added by Sjoerd */
function setCookie( name, value, expire, path )
{
  document.cookie = name + "=" + escape(value) + ((expire == null) ? "" : ("; expires=" + expire.toGMTString()))
                    + ((path == null) ? "" : ("; path=" + path));
}

function getCookie( Name )
{
  var s_return = "", search = Name + "=";
  if (document.cookie.length > 0)
  {
    offset = document.cookie.indexOf(search)
    if (offset != -1)
    {
      offset += search.length
      // set index of beginning of value
      end = document.cookie.indexOf(";", offset)
      // set index of end of cookie value
      if (end == -1)
        end = document.cookie.length
      s_return = unescape(document.cookie.substring(offset, end))
    }
  }
  return s_return;
}

function setShopCookie( name, value, expire )
{
  setCookie( name, value, expire, '' );
}

S_ITEM_SEPARATOR = ';';
S_IS_SEPARATOR = '=';

function RemoveCookieItemSeparators( s )
{
  return RemoveStrings( RemoveStrings( s, S_IS_SEPARATOR ), S_ITEM_SEPARATOR );
}

function GetCookieAndStripItem( CookieName, ItemName )
{
  var s_cookie = getCookie( CookieName );

  var offset = s_cookie.indexOf( ItemName + S_IS_SEPARATOR );

  if (offset != -1)
    s_cookie = s_cookie.slice( 0, offset ) + s_cookie.slice( (s_cookie.indexOf( S_ITEM_SEPARATOR, offset ) + 1) );

  return s_cookie;
}

function RemoveStrings( s, s_to_remove )
{
  if (s != '')
    do
    {
      var i = s.indexOf( s_to_remove );
      if (i != -1)
        s = s.slice( 0, i ) + s.slice( i + s_to_remove.length );
    }
    while ((i != -1) && (s != ''));

  return s;
}

function ReplaceItemInCookie( permanent, name_item, value )
{
  var CookieName = ( permanent ? PERMANENT_COOKIE_NAME : TEMPORARY_COOKIE_NAME ),
      s = GetCookieAndStripItem( CookieName, name_item ),
      expire;

  value = RemoveCookieItemSeparators( value );

  if ((s != "")
      && (s.slice( s.length - S_ITEM_SEPARATOR.length ) != S_ITEM_SEPARATOR))
    s = s + S_ITEM_SEPARATOR;
  s = s + name_item + S_IS_SEPARATOR + value + S_ITEM_SEPARATOR;

  expire = new Date();

  if (permanent)
    expire.setFullYear(expire.getFullYear() + 1);
  else
    expire.setTime( expire.getTime() + (1000 * 60 * 60 * 24 * 10) /*10 days*/ );

  setShopCookie( CookieName, s, expire );
}


function GetItemValue( permanent, name_item )
{
  var CookieName = ( permanent ? PERMANENT_COOKIE_NAME : TEMPORARY_COOKIE_NAME ),
      s_cookie = getCookie( CookieName ),
      s_search = name_item + S_IS_SEPARATOR,
      offset = s_cookie.indexOf( s_search ),
      result, s;

  if (offset == -1)
    result = '';
  else
    result = s_cookie.slice( (offset + s_search.length), s_cookie.indexOf( S_ITEM_SEPARATOR, offset ) );
  return result;
}

S_COUNTRY_NAME = 'Country';
S_VALUE_COUNTRY_UNKNOWN = 'unknown';

function GetCountry()
{
  var s_value = GetItemValue( true /*permanent*/, S_COUNTRY_NAME), result;
  if (s_value == '')
    result = S_VALUE_COUNTRY_UNKNOWN;
  else
    result = s_value;
  return result;
}

S_LIVES_IN_EU_UNKNOWN = 'Lives in EU Unknown';

function GetUserLivesInEU()
{
  var s = GetCountry();
  if (s == S_VALUE_COUNTRY_UNKNOWN)
    result = S_LIVES_IN_EU_UNKNOWN;
  else
    result = ((s == 'Netherlands') || (s == 'Belgium') || (s == 'Denmark') || (s == 'Germany') || (s == 'Finland')
             || (s == 'France') || (s == 'Greece') || (s == 'Ireland') || (s == 'Italy') || (s == 'Luxembourg')
             || (s == 'Austria') || (s == 'Portugal') || (s == 'Spain') || (s == 'Great Britain') || (s == 'Sweden')
             || (s == 'United Kingdom')
             || (s == 'Cyprus') || (s == 'Estonia') || (s == 'Hungary') || (s == 'Latvia') || (s == 'Lithuania')
             || (s == 'Malta') || (s == 'Poland') || (s == 'Slovenia') || (s == 'Slovakia') || (s == 'Czech Republic'));
  return result;
}

function SetOrderItem( BSIRef, nr )
{
  if (nr > 0)
    ReplaceItemInCookie( false /*not permanent*/, BSIRef, String(nr) );
  else
    setShopCookie( TEMPORARY_COOKIE_NAME, GetCookieAndStripItem( TEMPORARY_COOKIE_NAME, BSIRef ), null );
}

function GetOrderItem( BSIRef )
{
  var s_value = GetItemValue( false /*not permanent*/, BSIRef ), result;
  if (s_value == '')
    result = parseInt( "0" );
  else
    result = parseInt( s_value );

  return result;
}

function ask_confirm( nr )
{
  var s;
  if (nr == 1)
    s = 'is';
  else
    s = 'are';

  return window.confirm( 'There ' + s + ' already ' + String(nr) + ' of these in your basket.\n'
                         + 'Are you sure you want to add another one?' );
}

function ClickAddToBasketButtonOnProductPage( BSIRef )
{
  var nr = GetOrderItem( BSIRef );
  if (nr == 0)
  {
    SetOrderItem( BSIRef, 1 );
    alert( 'Item was added to your basket' );
  }
  else if (ask_confirm(nr))
    SetOrderItem( BSIRef, (nr + 1) );
}

